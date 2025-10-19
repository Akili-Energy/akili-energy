"use server";

import { db } from "@/lib/db/drizzle";
import { projects } from "@/lib/db/schema";
import { and, count, eq, or } from "drizzle-orm";
import type { Pagination, ProjectFilters } from "@/lib/types";
import { parseLocation } from "@/lib/utils";

export async function getProjects(
  filters?: ProjectFilters,
  order?: Pagination,
  cursor?: { createdAt: Date; id: string },
  search = "",
  pageSize = 10
) {
  try {
    // Base query for filtering
    const { region, sector, ...projectFilters } = filters || {};
    const where =
      projectFilters &&
      Object.values(projectFilters).some((v) => v !== undefined)
        ? and(
            ...Object.entries(projectFilters)
              .filter(([v]) => v !== undefined)
              .map(([k, v]) =>
                eq(
                  projects[
                    k as keyof Omit<ProjectFilters, "region" | "sector">
                  ],
                  v as any
                )
              )
          )
        : undefined;

    // Separate query for the total count based on filters
    const totalQuery = db
      .select({ count: count() })
      .from(projects)
      .where(where);

    // Main data fetching query
    const resultsQuery = db.query.projects.findMany({
      columns: {
        id: true,
        name: true,
        stage: true,
        plantCapacity: true,
        investmentCosts: true,
        createdAt: true,
      },
      with: {
        country: {
          columns: {
            code: true,
            region: true,
          },
          // where: region ? (country) => eq(country.region, region) : undefined,
        },
        projectsSectors: {
          columns: { sector: true },
          // with: {
          //   sector: {
          //     columns: { id: true },
          //   },
          // },
          where: sector
            ? (projectsSectors) => eq(projectsSectors.sector, sector)
            : undefined,
        },
        projectsCompanies: {
          columns: { role: true },
          where: (projectsCompanies, { eq }) =>
            eq(projectsCompanies.role, "sponsor"),
          with: {
            company: {
              columns: {
                name: true,
              },
            },
          },
          limit: 1,
        },
        details: {
          columns: {
            operationalDate: true,
          },
        },
      },
      where: (projects, { or, gt, lt }) =>
        and(
          where,
          cursor?.createdAt
            ? or(
                (order === "previous" ? gt : lt)(
                  projects.createdAt,
                  cursor.createdAt
                ),
                and(
                  eq(projects.createdAt, cursor.createdAt),
                  (order === "previous" ? gt : lt)(projects.id, cursor.id)
                )
              )
            : undefined
        ),
      orderBy: (projects, { asc, desc }) =>
        order === "previous"
          ? [asc(projects.createdAt), asc(projects.id)]
          : [desc(projects.createdAt), desc(projects.id)],
      limit: pageSize + 1,
    });

    const [results, totalResult] = await Promise.all([
      resultsQuery,
      totalQuery,
    ]);

    const hasMore = results.length > pageSize;
    if (hasMore) results.pop();

    if (order === "previous") results.reverse();

    const createCursor = ({ createdAt, id }: (typeof results)[number]) => ({
      createdAt,
      id,
    });

    const nextCursor =
      order !== "previous" && hasMore
        ? createCursor(results[results.length - 1])
        : order === "previous" && cursor
        ? cursor
        : undefined;
    const prevCursor =
      order === "previous" && hasMore
        ? createCursor(results[0])
        : order === "next" && cursor
        ? cursor
        : undefined;

    return {
      projects: results.map(
        ({
          country,
          projectsSectors,
          projectsCompanies,
          details,
          ...project
        }) => {
          return {
            ...project,
            sponsor: projectsCompanies[0]?.company.name,
            country: country ? country.code : null,
            region: country?.region,
            date: details?.operationalDate,
            sectors: projectsSectors.map(({ sector }) => sector),
          };
        }
      ),
      total: totalResult[0]?.count ?? 0,
      nextCursor,
      prevCursor,
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error("Failed to fetch projects");
  }
}

export async function getProjectById(id: string) {
  try {
    const result = await db.query.projects.findFirst({
      columns: { location: false },
      where: (projects, { eq }) => eq(projects.id, id),
      extras: (projects, { sql }) => ({
        location: sql<string>`ST_AsText(${projects.location})`.as("location"),
      }),
      with: {
        country: {
          columns: {
            code: true,
            region: true,
          },
        },
        projectsSectors: {
          columns: {
            sector: true,
          },
        },
        projectsTechnologies: {
          columns: {
            technology: true,
          },
        },
        projectsCompanies: {
          columns: {
            role: true,
            percentageOwnership: true,
            equityAmount: true,
            details: true,
          },
          with: {
            company: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
        },
        dealsAssets: {
          with: {
            deal: {
              columns: {
                id: true,
                update: true,
                date: true,
                type: true,
              },
            },
          },
        },
        details: true,
        proposal: true,
      },
    });

    if (!result) return null;

    // Destructure to separate nested objects and flatten the structure
    const {
      projectsSectors,
      projectsTechnologies,
      projectsCompanies,
      dealsAssets,
      details,
      proposal,
      ...projectCore
    } = result;

    console.log(result?.location);

    return {
      ...projectCore,
      // Combine details and proposal into the top-level object
      ...(details ?? {}),
      ...(proposal ?? {}),
      // Flatten related data into simple arrays
      sectors: projectsSectors.map((ps) => ps.sector),
      technologies: projectsTechnologies.map((pt) => pt.technology),
      companies: projectsCompanies.map(({ company, ...roleInfo }) => ({
        id: company.id,
        name: company.name,
        ...roleInfo,
      })),
      // Parse location string into coordinates
      location: parseLocation(result.location),
      deals: dealsAssets
        .map(({ deal }) => deal)
        .filter((deal) => deal.type === "project_update")
        .toSorted((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 5), // Get only project updates, sorted by date desc, limit to 5
    };
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    throw new Error("Failed to fetch project");
  }
}
