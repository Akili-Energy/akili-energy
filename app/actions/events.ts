"use server";

import { db } from "@/lib/db/drizzle";
import { eventOrganizers, companies, events } from "@/lib/db/schema";
import { ActionState } from "@/lib/types";
import { parseLocation } from "@/lib/utils";
import { and, count, eq, ilike, lt, or, sql } from "drizzle-orm";
import z from "zod";
import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "./auth";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { redirect } from "next/navigation";

export async function getEvents({
  cursor,
  search = "",
  pageSize = DEFAULT_PAGE_SIZE,
}: {
  cursor?: Date;
  search?: string;
  pageSize?: number;
}) {
  let redirectPath: string | undefined;
  try {
    const userRole = await getUserRole();
    if (userRole === null || userRole === undefined) {
      console.log("User role not found, redirecting to login.");
      redirectPath = "/login";
    }
    const isGuestUser = userRole === "guest";

    const filterClauses = [];

    if (search) {
      filterClauses.push(
        or(
          ilike(events.title, `%${search}%`),
          ilike(events.description, `%${search}%`)
        )
      );
    }

    const where =
      !isGuestUser && filterClauses.length > 0
        ? and(...filterClauses)
        : undefined;

    // Clause for cursor-based pagination
    let cursorClause;
    if (cursor) {
      cursorClause = lt(events.start, cursor);
    }

    const finalWhere = and(...[where, cursorClause].filter(Boolean));

    const [results, totalResult] = await Promise.all([
      db.query.events.findMany({
        columns: {
          location: false,
          updatedAt: false,
        },
        with: {
          organizer: {
            columns: { name: true },
          },
        },
        where: finalWhere,
        orderBy: (events, { desc }) => [desc(events.start), desc(events.id)],
        limit: isGuestUser ? DEFAULT_PAGE_SIZE + 1 : pageSize + 1,
      }),
      // Total count should ignore cursor for accurate total
      db.select({ count: count() }).from(events).where(where),
    ]);

    const hasMore = results.length > pageSize;
    if (hasMore) results.pop();

    const eventsCount = totalResult[0]?.count ?? 0;
    if (!redirectPath) {
      return {
        events: results,
        total: isGuestUser
          ? Math.min(eventsCount, DEFAULT_PAGE_SIZE)
          : eventsCount,
        hasMore,
      };
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    throw new Error("Failed to fetch events");
  } finally {
    if (redirectPath) {
      redirect(redirectPath!);
    }
  }
}

// Action to fetch all organizers for the dropdown
export async function getOrganizers() {
  try {
    const [organizers, companies] = await Promise.all([
      db.query.eventOrganizers.findMany({
        orderBy: (organizers, { asc }) => [asc(organizers.name)],
      }),
      db.query.companies.findMany({
        columns: {
          name: true,
          website: true,
        },
        extras: (companies, { sql }) => ({
          id: sql<string>`CONCAT('company-', ${companies.id})`.as("id"),
          bio: sql<string>`${companies.description}`.as("bio"),
          imageUrl: sql<string>`${companies.logoUrl}`.as("image_url"),
          registrationDate: sql<Date>`${companies.createdAt}`.as(
            "registration_date"
          ),
        }),
        orderBy: (companies, { asc }) => [asc(companies.name)],
      }),
    ]);
    return [...new Set([...organizers, ...companies])].toSorted((a, b) =>
      a.name.localeCompare(b.name)
    );
  } catch (error) {
    console.error("Failed to fetch organizers:", error);
    return [];
  }
}

// Action to fetch a single event for the edit page
export async function getEventById(id: string) {
  try {
    const event = await db.query.events.findFirst({
      where: (events, { eq }) => eq(events.id, id),
      columns: {
        location: false,
      },
      with: {
        organizer: true,
      },
      extras: (events, { sql }) => ({
        // Convert PostGIS point back to a "lng,lat" string for the form
        location: sql<string>`ST_AsText(${events.location})`.as("location"),
      }),
    });
    if (event) {
      const location = parseLocation(event?.location);
      return { ...event, location };
    }
    return event;
  } catch (error) {
    console.error("Failed to fetch event:", error);
    return null;
  }
}

// Zod schema for validation
const upsertEventSchema = z
  .object({
    eventId: z.uuid().optional(),
    title: z.string().min(3, "Title is required."),
    description: z.string().min(10, "Description is required."),
    virtual: z.preprocess((val) => val === "on" || val === true, z.boolean()),
    start: z.coerce.date({ error: "Start date is required." }),
    endDate: z.coerce.date({ error: "End date is required." }),
    address: z.string().min(3, "Address or 'Online' is required."),
    location: z.string().optional(), // "lng,lat"
    website: z.url().optional(),
    registrationUrl: z.url().optional(),
    imageUrl: z.url().optional(),

    // Organizer fields - either an existing ID or data for a new one
    organizerId: z.string().optional(),
    newOrganizerName: z.string().optional(),
    newOrganizerBio: z.string().optional(),
    newOrganizerWebsite: z.url().optional(),
    newOrganizerImageUrl: z.url().optional(),
  })
  .refine((data) => data.organizerId || data.newOrganizerName, {
    message:
      "You must either select an existing organizer or create a new one.",
    path: ["organizerId"], // Attach error to the main organizer field
  });

export async function upsertEvent(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { auth } = await createClient();

  const {
    data: { user },
  } = await auth.getUser();
  if (!user) {
    return { success: false, message: "Authentication failed." };
  }

  const validatedFields = upsertEventSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid form data.",
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  const data = validatedFields.data;
  const isEditMode = !!data.eventId;

  try {
    await db.transaction(async (tx) => {
      let finalOrganizerId = data.organizerId;

      if (data.organizerId?.startsWith("company-")) {
        const [newOrganizer] = await tx
          .insert(eventOrganizers)
          .select(
            tx
              .select({
                id: companies.id,
                name: companies.name,
                imageUrl: sql`${companies.logoUrl}`.as("image_url"),
                bio: sql`${companies.description}`.as("bio"),
                website: companies.website,
                companyId: sql`${companies.id}`.as("company_id"),
                registrationDate: sql`CURRENT_TIMESTAMP`.as(
                  "registration_date"
                ),
              })
              .from(companies)
              .where(eq(companies.id, data.organizerId.replace("company-", "")))
              .limit(1)
          )
          .returning({ id: eventOrganizers.id });
        finalOrganizerId = newOrganizer.id;
      }

      // 1. If new organizer data is present, create it first
      if (data.newOrganizerName) {
        const [newOrganizer] = await tx
          .insert(eventOrganizers)
          .values({
            name: data.newOrganizerName,
            bio: data.newOrganizerBio,
            website: data.newOrganizerWebsite,
            imageUrl: data.newOrganizerImageUrl,
          })
          .returning({ id: eventOrganizers.id });
        finalOrganizerId = newOrganizer.id;
      }

      if (!finalOrganizerId) {
        throw new Error("Organizer is missing.");
      }

      // 2. Prepare event data, including PostGIS location
      const location =
        (data.location?.split(",").map(parseFloat) as [number, number]) ||
        undefined;

      const eventPayload = {
        title: data.title,
        description: data.description,
        virtual: data.virtual,
        start: data.start,
        endDate: data.endDate,
        address: data.address,
        location,
        website: data.website,
        registrationUrl: data.registrationUrl,
        imageUrl: data.imageUrl,
        organizerId: finalOrganizerId,
      };

      // 3. Insert or Update the event
      if (isEditMode) {
        await tx
          .update(events)
          .set(eventPayload)
          .where(eq(events.id, data.eventId!));
      } else {
        await tx.insert(events).values(eventPayload);
      }
    });
  } catch (error: any) {
    console.error(error)
    return { success: false, message: `Database Error: ${error.message}` };
  }

  return {
    success: true,
    message: `Event has been successfully ${
      isEditMode ? "updated" : "created"
    }.`,
  };
}

export async function deleteEvent(
  id: string
): Promise<{ success: boolean; message: string }> {
  const { auth } = await createClient();

  // Authenticate user and check permissions
  const {
    data: { user },
  } = await auth.getUser();
  if (!user) {
    return { success: false, message: "Authentication failed." };
  }

  // Optional: Check if the user has an 'admin' or 'analyst_editor' role
  // This depends on your user role management setup
  // const userRole = ... ;
  // if (userRole !== 'admin' && userRole !== 'analyst_editor') {
  //   return { success: false, message: "Permission denied." };
  // }

  try {
    const deleted = await db
      .delete(events)
      .where(eq(events.id, id))
      .returning({ id: events.id });

    if (deleted.length === 0) {
      return {
        success: false,
        message: "Event not found.",
      };
    }

    return {
      success: true,
      message: `Successfully deleted event #${deleted[0].id}.`,
    };
  } catch (error: any) {
    console.error("Failed to delete event:", error);
    return { success: false, message: `Error: ${error.message}` };
  }
}
