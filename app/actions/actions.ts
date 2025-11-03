"use server";

import { db } from "@/lib/db/drizzle";
import {
  companies,
  companiesOperatingCountries,
  companiesSectors,
  companiesTechnologies,
  countriesByCapacityAndFinancing,
  deals,
  dealsAssets,
  dealsByMonthAndType,
  dealsCompanies,
  dealsCountries,
  financing,
  financingDealsByMonthAndType,
  jointVentures,
  mergersAcquisitions,
  powerPurchaseAgreements,
  ppaDealsByDuration,
  ppaDealsByOfftakerSector,
  ppaDealsBySubtype,
  projectDetails,
  projects,
  projectsByMonthAndSector,
  projectsByMonthAndStage,
  projectsBySector,
  projectsCompanies,
  projectsSectors,
  projectsTechnologies,
  proposals,
  topCountriesByDealValue,
  topCompaniesByFinancingAndCapacity,
  eventOrganizers,
  events,
} from "@/lib/db/schema";
import {
  Country,
  DealFinancingType,
  DealType,
  ProjectSector,
  ProjectStage,
  Sector,
  Technology,
} from "@/lib/types";
import { eq, getTableColumns } from "drizzle-orm";
import { PgColumn, PgTableWithColumns } from "drizzle-orm/pg-core";
import { revalidatePath, cacheTag, updateTag } from "next/cache";
import z from "zod";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/types";
import { parseLocation } from "@/lib/utils";

export async function fetchDeals() {
  "use cache";
  cacheTag("deals");
  try {
    return await db.query.deals.findMany({
      columns: {
        id: true,
        update: true,
      },
      extras: (deals, { sql }) => ({
        name: sql<string>`${deals.update}`.as("name"),
      }),
    });
  } catch (error) {
    console.error("Error fetching deals:", error);
    throw new Error("Failed to fetch deals");
  }
}

export async function fetchProjects() {
  "use cache";
  cacheTag("projects");
  try {
    return (
      await db.query.projects.findMany({
        columns: {
          id: true,
          name: true,
          plantCapacity: true,
          stage: true,
          onOffGrid: true,
          colocatedStorageCapacity: true,
          segments: true,
          subSectors: true,
        },
        with: {
          country: {
            columns: {
              code: true,
            },
          },
          projectsSectors: {
            columns: { sector: true },
          },
          projectsTechnologies: {
            columns: { technology: true },
          },
        },
        orderBy: (projects, { asc }) => [asc(projects.name)],
      })
    ).map(({ country, projectsSectors, projectsTechnologies, ...project }) => ({
      ...project,
      country: country ? country.code : null,
      sectors: projectsSectors.map((ps) => ps.sector),
      technologies: projectsTechnologies.map((pt) => pt.technology),
    }));
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error("Failed to fetch projects");
  }
}

export async function fetchCompanies() {
  "use cache";
  cacheTag("companies");
  try {
    return (
      await db.query.companies.findMany({
        columns: {
          id: true,
          name: true,
          classification: true,
        },
        with: {
          companiesSectors: {
            columns: { sector: true },
          },
          companiesTechnologies: {
            columns: { technology: true },
          },
        },
        orderBy: (companies, { asc }) => [asc(companies.name)],
      })
    ).map(({ companiesSectors, companiesTechnologies, ...company }) => ({
      ...company,
      sectors: companiesSectors.map((cs) => cs.sector),
      technologies: companiesTechnologies.map((ct) => ct.technology),
    }));
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw new Error("Failed to fetch companies");
  }
}

export async function getProjectsCompanies() {
  try {
    return (
      await db.query.projectsCompanies.findMany({
        columns: {
          projectId: true,
          companyId: true,
          role: true,
        },
        with: {
          project: { columns: { name: true } },
          company: { columns: { name: true } },
        },
      })
    ).map(
      ({
        project: { name: projectName },
        company: { name: companyName },
        ...projectsCompanies
      }) => ({ ...projectsCompanies, projectName, companyName })
    );
  } catch (error) {
    console.error("Error fetching projects-companies:", error);
    throw new Error("Failed to fetch projects-companies");
  }
}

export async function getDealsCompanies() {
  try {
    return (
      await db.query.dealsCompanies.findMany({
        columns: {
          dealId: true,
          companyId: true,
          role: true,
        },
        with: {
          deal: { columns: { update: true } },
          company: { columns: { name: true } },
        },
      })
    ).map(
      ({
        deal: { update: dealUpdate },
        company: { name: companyName },
        ...dealsCompanies
      }) => ({ ...dealsCompanies, dealUpdate, companyName })
    );
  } catch (error) {
    console.error("Error fetching Deals-Companies:", error);
    throw new Error("Failed to fetch Deals-Companies");
  }
}

export async function getDealsAssets() {
  try {
    return (
      await db.query.dealsAssets.findMany({
        columns: {
          dealId: true,
          assetId: true,
        },
        with: {
          deal: { columns: { update: true } },
          asset: { columns: { name: true } },
        },
      })
    ).map(
      ({
        deal: { update: dealUpdate },
        asset: { name: assetName },
        ...dealsAssets
      }) => ({ ...dealsAssets, dealUpdate, assetName })
    );
  } catch (error) {
    console.error("Error fetching Deals-Assets:", error);
    throw new Error("Failed to fetch Deals-Assets");
  }
}

const OPTIONAL_INSERT_KEYS = [
  "id",
  "createdAt",
  "created_at",
  "updatedAt",
  "updated_at",
];

export async function seedDatabase(payload: {
  dataType: string;
  subType: string;
  tables: { name: string; data: any[] }[];
}) {
  const { tables } = payload;

  const getTableData = (name: string) =>
    (tables.find((t) => t.name === name)?.data as Array<Record<string, any>>) ||
    [];

  type TableName = "deals" | "projects" | "companies";
  type ParsedData = Partial<{
    [key in TableName]: any[];
  }> & {
    countries?: Record<string, Country[]>;
    sectors: Record<string, Sector[]>;
    technologies: Record<string, Technology[]>;
  };
  const extractData = (
    table: TableName,
    field: "id" | "name" | "update"
  ): ParsedData =>
    getTableData(table).reduce<ParsedData>(
      (acc: ParsedData, row) => {
        const { id, countries, sectors, technologies, ...rest } = row;

        acc[table]?.push(rest);

        const value: string = row[field];
        if (countries && acc.countries)
          acc.countries[value] = Array.isArray(countries)
            ? ([...new Set(countries)] as Country[])
            : [];
        acc.sectors[value] = Array.isArray(sectors)
          ? ([...new Set(sectors)] as Sector[])
          : [];
        acc.technologies[value] = Array.isArray(technologies)
          ? ([...new Set(technologies)] as Technology[])
          : [];

        return acc;
      },
      { [table]: [], countries: {}, sectors: {}, technologies: {} }
    );

  const filterObject = <T extends Record<string, any>>(
    data: Record<string, any>,
    keys: (keyof T)[]
  ): T =>
    keys.reduce((acc, key) => {
      acc[key] = data[key as string];
      return acc;
    }, {} as T);

  try {
    const result = await db.transaction(async (tx) => {
      const insertedCounts: Record<
        string,
        { inserted: number; names: string[] }
      > = {};

      const getTableInsertColumns = <T extends PgTableWithColumns<any>>(
        table: T
      ) => {
        return Object.entries(
          getTableColumns(table) as Record<string, PgColumn>
        )
          .filter(
            ([k, { name, primary, columnType }]) =>
              !OPTIONAL_INSERT_KEYS.includes(k) ||
              !OPTIONAL_INSERT_KEYS.includes(name) ||
              !(primary && columnType === "pgUUID")
          )
          .map(([k]) => k as keyof T["$inferInsert"]);
      };

      const insertData = <T extends PgTableWithColumns<any>>(
        table: T,
        data: Array<T["$inferInsert"]>
      ) => tx.insert(table).values(data);
      // .onConflictDoNothing();

      const insertLinkedData = <
        T extends PgTableWithColumns<any>,
        I extends Record<string, any>
      >(
        data: Record<string, any[]>,
        table: T,
        id: keyof T["$inferInsert"],
        column: keyof T["$inferInsert"],
        field: keyof I,
        inserted: I[]
      ) =>
        Promise.all(
          Object.entries(data).map(([k, v]) => {
            if (!v) return Promise.resolve();
            const tableData = v
              .map(
                (element) =>
                  ({
                    [id]: inserted.find(({ [field]: key }) => key === k)?.id,
                    [column]: element,
                  } as T["$inferInsert"])
              )
              .filter((row) => row[id] && row[column]);
            return tableData.length
              ? insertData(table, tableData)
              : Promise.resolve();
          })
        );

      const insertChildData = async <
        T extends PgTableWithColumns<any>,
        I extends Record<string, any>
      >(
        data: Array<Record<string, any>>,
        table: T,
        id: keyof T["$inferInsert"],
        field: keyof I,
        inserted: I[]
      ) => {
        const tableData = data
          .map((row) => ({
            ...filterObject(row, getTableInsertColumns(table)),
            [id]: inserted.find(
              ({ [field]: key }) => key === row[field as string]
            )?.id,
          }))
          .filter(
            (row) =>
              row &&
              row?.[id] &&
              Object.keys(row).length > 2 &&
              JSON.stringify(row) !== "{}"
          );
        if (tableData.length) await insertData(table, tableData);
      };

      const insertRelationship = async <
        T extends PgTableWithColumns<any>,
        I1 extends Record<string, any>,
        I2 extends Record<string, any>
      >(
        table: T,
        data: Array<Record<string, any>>,
        id1: keyof T["$inferInsert"],
        inserted1: I1[],
        field1: keyof I1,
        key1: string,
        id2: keyof T["$inferInsert"],
        inserted2: I2[],
        field2: keyof I2,
        key2: string
      ) => {
        const tableData = data
          .map(({ [key1]: k1, [key2]: k2, ...row }) => ({
            ...row,
            [id1]: inserted1.find(({ [field1]: k }) => k === k1)?.id,
            [id2]: inserted2.find(({ [field2]: k }) => k === k2)?.id,
          }))
          .filter((row) => row[id1 as string] && row[id2 as string]);
        if (tableData.length) return await insertData(table, tableData);
      };

      //
      const allDeals = await fetchDeals();
      const allProjects = await fetchProjects();
      const allCompanies = await fetchCompanies();

      // 1. Insert core entities first (Companies, Projects, Deals)
      // Using onConflictDoNothing to avoid errors if an entity already exists.
      const companiesData = extractData("companies", "name");
      let insertedCompanies: { id: string; name: string }[] = [];
      if (companiesData.companies!.length > 0) {
        insertedCompanies = await insertData(
          companies,
          companiesData.companies!
        ).returning({ id: companies.id, name: companies.name });

        await insertLinkedData(
          companiesData.countries!,
          companiesOperatingCountries,
          "companyId",
          "countryCode",
          "name",
          insertedCompanies
        );
        await insertLinkedData(
          companiesData.sectors,
          companiesSectors,
          "companyId",
          "sector",
          "name",
          insertedCompanies
        );
        await insertLinkedData(
          companiesData.technologies,
          companiesTechnologies,
          "companyId",
          "technology",
          "name",
          insertedCompanies
        );

        insertedCounts.companies = {
          inserted: insertedCompanies.length,
          names: insertedCompanies.map(({ name }) => name),
        };
      }

      const projectsData = extractData("projects", "name");
      let insertedProjects: { id: string; name: string }[] = [];
      if (projectsData.projects!.length > 0) {
        insertedProjects = await insertData(
          projects,
          projectsData.projects!.map((p) =>
            filterObject(p, getTableInsertColumns(projects))
          )
        ).returning({ id: projects.id, name: projects.name });

        await insertLinkedData(
          projectsData.sectors,
          projectsSectors,
          "projectId",
          "sector",
          "name",
          insertedProjects
        );
        await insertLinkedData(
          projectsData.technologies,
          projectsTechnologies,
          "projectId",
          "technology",
          "name",
          insertedProjects
        );

        await insertChildData(
          projectsData.projects!,
          projectDetails,
          "projectId",
          "name",
          insertedProjects
        );
        await insertChildData(
          projectsData.projects!,
          proposals,
          "projectId",
          "name",
          insertedProjects
        );

        insertedCounts.projects = {
          inserted: insertedProjects.length,
          names: insertedProjects.map(({ name }) => name),
        };
      }

      const dealsData = extractData("deals", "update");
      let insertedDeals: { id: string; update: string }[] = [];
      if (dealsData.deals!.length > 0) {
        insertedDeals = await insertData(
          deals,
          dealsData.deals!.map((d) =>
            filterObject(d, getTableInsertColumns(deals))
          )
        ).returning({ id: deals.id, update: deals.update });

        await insertLinkedData(
          dealsData.countries!,
          dealsCountries,
          "dealId",
          "countryCode",
          "update",
          insertedDeals
        );

        await insertChildData(
          dealsData.deals!.filter((d) => d.type === "merger_acquisition"),
          mergersAcquisitions,
          "dealId",
          "update",
          insertedDeals
        );
        await insertChildData(
          dealsData.deals!.filter((d) => d.type === "financing"),
          financing,
          "dealId",
          "update",
          insertedDeals
        );
        await insertChildData(
          dealsData.deals!.filter((d) => d.type === "power_purchase_agreement"),
          powerPurchaseAgreements,
          "dealId",
          "update",
          insertedDeals
        );
        await insertChildData(
          dealsData.deals!.filter((d) => d.type === "joint_venture"),
          jointVentures,
          "dealId",
          "update",
          insertedDeals
        );

        insertedCounts.deals = {
          inserted: insertedDeals.length,
          names: insertedDeals.map(({ update }) => update),
        };
      }

      // 4. Insert relationship data
      const newDeals = [...allDeals, ...insertedDeals];
      const newProjects = [...allProjects, ...insertedProjects];
      const newCompanies = [...allCompanies, ...insertedCompanies];
      const companiesProjects = await getProjectsCompanies();
      const companiesDeals = await getDealsCompanies();
      const projectsDeals = await getDealsAssets();
      await insertRelationship(
        projectsCompanies,
        getTableData("projects_companies").filter(
          (dp1) =>
            !companiesProjects.some(
              (dp2) =>
                dp2.projectName === dp1.projectName &&
                dp2.companyName === dp1.companyName
            )
        ),
        "projectId",
        newProjects,
        "name",
        "projectName",
        "companyId",
        newCompanies,
        "name",
        "companyName"
      );
      await insertRelationship(
        dealsAssets,
        getTableData("deals_assets").filter(
          (da1) =>
            !projectsDeals.some(
              (da2) =>
                da2.dealUpdate === da1.dealName &&
                da2.assetName === da1.assetName
            )
        ),
        "dealId",
        newDeals,
        "update",
        "dealName",
        "assetId",
        newProjects,
        "name",
        "assetName"
      );
      await insertRelationship(
        dealsCompanies,
        getTableData("deals_companies").filter(
          (dc1) =>
            !companiesDeals.some(
              (dc2) =>
                dc2.dealUpdate === dc1.dealName &&
                dc2.companyName === dc1.companyName
            )
        ),
        "dealId",
        newDeals,
        "update",
        "dealName",
        "companyId",
        newCompanies,
        "name",
        "companyName"
      );

      return insertedCounts;
    });

    await db.refreshMaterializedView(dealsByMonthAndType).concurrently();
    await db.refreshMaterializedView(financingDealsByMonthAndType);
    await db.refreshMaterializedView(ppaDealsByOfftakerSector).concurrently();
    await db.refreshMaterializedView(ppaDealsBySubtype).concurrently();
    await db.refreshMaterializedView(ppaDealsByDuration).concurrently();
    await db.refreshMaterializedView(projectsByMonthAndSector).concurrently();
    await db.refreshMaterializedView(projectsBySector).concurrently();
    await db.refreshMaterializedView(projectsByMonthAndStage).concurrently();
    await db.refreshMaterializedView(topCountriesByDealValue).concurrently();
    await db
      .refreshMaterializedView(topCompaniesByFinancingAndCapacity)
      .concurrently();
    await db
      .refreshMaterializedView(countriesByCapacityAndFinancing)
      .concurrently();

    // Revalidate paths to update cached data
    revalidatePath("/admin/seed");
    updateTag("companies");
    updateTag("projects");
    updateTag("deals");

    return { success: true, result };
  } catch (err: any) {
    console.error("Database seed failed:", err);
    return {
      success: false,
      error: err.message || "An unknown error occurred.",
    };
  }
}

async function getLatestDeals() {
  try {
    // 1. Fetch the 5 latest deals with all necessary related data
    const latestDealsData = await db.query.deals.findMany({
      limit: 5,
      columns: {
        id: true,
        update: true,
        type: true,
        subtype: true,
        amount: true,
        date: true,
        announcementDate: true,
      },
      with: {
        // Eager load countries for calculating the 'location'
        dealsCountries: {
          with: {
            country: {
              columns: {
                code: true,
                region: true,
              },
            },
          },
        },
        // Eager load project assets for 'asset', 'sectors', and 'projectStage'
        dealsAssets: {
          with: {
            asset: {
              columns: {
                name: true,
                stage: true,
              },
              with: {
                projectsSectors: {
                  columns: {
                    sector: true,
                  },
                },
              },
            },
          },
        },
        // Eager load company assets for 'asset' and 'sectors'
        dealsCompanies: {
          with: {
            company: {
              columns: {
                name: true,
              },
              with: {
                companiesSectors: {
                  columns: {
                    sector: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: (deals, { desc }) => [
        desc(deals.date),
        desc(deals.announcementDate),
      ],
    });

    // 2. Map the raw database results to the desired final structure
    return latestDealsData.map(
      ({
        type,
        subtype,
        dealsCompanies,
        dealsAssets,
        dealsCountries,
        date,
        announcementDate,
        ...deal
      }) => {
        // Determine if the deal is corporate-focused (M&A Corporate or Financing)
        const isCorporateDeal =
          (type === "merger_acquisition" && subtype === "ma_corporate") ||
          type === "financing";

        // Logic to determine the 'asset' string
        const asset = (
          isCorporateDeal
            ? dealsCompanies.map((c) => c.company.name)
            : dealsAssets.map((a) => a.asset.name)
        ).join(" | ");

        // Logic to gather unique 'sectors' based on deal type
        const sectors = [
          ...new Set(
            isCorporateDeal
              ? dealsCompanies.flatMap((c) =>
                  c.company.companiesSectors.map((s) => s.sector)
                )
              : dealsAssets.flatMap((a) =>
                  a.asset.projectsSectors.map((s) => s.sector)
                )
          ),
        ];

        // Logic to determine the 'location' based on associated countries
        let location = "Multiple";
        const countries = dealsCountries.map((dc) => dc.country);
        if (countries.length === 1) {
          location = countries[0].code;
        } else if (countries.length > 1) {
          const regions = [...new Set(countries.map((c) => c.region))];
          if (regions.length === 1) {
            location = regions[0];
          }
        }
        // Construct the final object for the API response
        return {
          type,
          subtype,
          asset,
          sectors,
          // Prioritize the main deal date, fallback to announcement date
          date: new Date(date ?? announcementDate),
          location,
          projectStage:
            dealsAssets.length === 1 ? dealsAssets[0].asset.stage : null,
          ...deal,
        };
      }
    );
  } catch (error) {
    console.error("Error fetching latest deals:", error);
    // In a real application, you might want to throw a more specific error
    throw new Error("Failed to fetch latest deals.");
  }
}

export async function getDealsAnalytics() {
  try {
    return {
      dealsByMonthAndType: Object.values(
        (await db.select().from(dealsByMonthAndType))
          .toSorted(({ month: a }, { month: b }) => a.localeCompare(b))
          .reduce((acc, { month, dealType, dealCount }) => {
            if (!acc[month]) {
              acc[month] = { month };
            }
            acc[month][dealType] = dealCount;
            acc[month].dealCount = (acc[month].dealCount || 0) + dealCount;
            return acc;
          }, {} as Partial<Record<string, Partial<Record<DealType, number>> & { month: string; dealCount?: number }>>)
      ),
      financingDealsByMonthAndType: Object.values(
        (await db.select().from(financingDealsByMonthAndType))
          .toSorted(({ month: a }, { month: b }) => a.localeCompare(b))
          .reduce((acc, { month, financingType, dealCount, totalAmount }) => {
            if (!acc[month]) {
              acc[month] = { month, amount: totalAmount };
            } else {
              acc[month].amount += totalAmount;
            }
            acc[month][financingType] = dealCount;
            return acc;
          }, {} as Partial<Record<string, Partial<Record<DealFinancingType, number>> & { month: string; amount: number }>>)
      ),
      ppaDealsByOfftakerSector: await db
        .select()
        .from(ppaDealsByOfftakerSector),
      ppaDealsBySubtype: (await db.select().from(ppaDealsBySubtype)).map(
        (data) => ({
          ...data,
          color: `#${Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0")}`,
        })
      ),
      ppaDealsByDuration: (await db.select().from(ppaDealsByDuration)).toSorted(
        ({ duration: a }, { duration: b }) => (a ?? Infinity) - (b ?? Infinity)
      ),
      topCountriesByDealValue: await db.select().from(topCountriesByDealValue),
      topCompaniesByFinancingAndCapacity: await db
        .select()
        .from(topCompaniesByFinancingAndCapacity),
      latestDeals: await getLatestDeals(),
    };
  } catch (error) {
    console.error("Error fetching deals:", error);
    throw new Error("Failed to fetch deals");
  }
}

export async function getProjectsAnalytics() {
  try {
    return {
      projectsByMonthAndSector: Object.values(
        (await db.select().from(projectsByMonthAndSector))
          .toSorted(({ month: a }, { month: b }) => a.localeCompare(b))
          .reduce((acc, { month, sector, totalCapacity, totalAmount }) => {
            if (!acc[month]) {
              acc[month] = { month, amount: totalAmount };
            } else {
              acc[month].amount += totalAmount;
            }
            acc[month][sector] = totalCapacity;
            return acc;
          }, {} as Partial<Record<string, Partial<Record<ProjectSector, number>> & { month: string; amount: number }>>)
      ),
      projectsByMonthAndStage: Object.values(
        (await db.select().from(projectsByMonthAndStage))
          .toSorted(({ month: a }, { month: b }) => a.localeCompare(b))
          .reduce((acc, { month, projectStage, projectCount }) => {
            if (!acc[month]) acc[month] = { month };
            if (projectStage) acc[month][projectStage] = projectCount;
            return acc;
          }, {} as Partial<Record<string, Partial<Record<ProjectStage, number>> & { month: string }>>)
      ),
      projectsBySector: (await db.select().from(projectsBySector)).map(
        (data) => ({
          ...data,
          color: `#${Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0")}`,
        })
      ),
      countriesByCapacityAndFinancing: await db
        .select()
        .from(countriesByCapacityAndFinancing),
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error("Failed to fetch projects");
  }
}

// Action to fetch all organizers for the dropdown
export async function getOrganizers() {
  try {
    return await db.query.eventOrganizers.findMany({
      orderBy: (organizers, { asc }) => [asc(organizers.name)],
    });
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
      return {...event, location};
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
    website: z.url().or(z.literal("")).optional(),
    registrationUrl: z.url().or(z.literal("")).optional(),
    imageUrl: z
      .url("A valid image URL is required.")
      .optional()
      .or(z.literal("")),

    // Organizer fields - either an existing ID or data for a new one
    organizerId: z.uuid().optional(),
    newOrganizerName: z.string().optional(),
    newOrganizerBio: z.string().optional(),
    newOrganizerWebsite: z.string().url().or(z.literal("")).optional(),
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

      // 1. If new organizer data is present, create it first
      if (data.newOrganizerName) {
        const [newOrganizer] = await tx
          .insert(eventOrganizers)
          .values({
            name: data.newOrganizerName,
            bio: data.newOrganizerBio,
            website: data.newOrganizerWebsite,
          })
          .returning({ id: eventOrganizers.id });
        finalOrganizerId = newOrganizer.id;
      }

      if (!finalOrganizerId) {
        throw new Error("Organizer ID is missing.");
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
    return { success: false, message: `Database Error: ${error.message}` };
  }

  revalidatePath("/admin/events");
  // If you have a public events page, revalidate it too
  // revalidatePath("/events");

  return {
    success: true,
    message: `Event has been successfully ${
      isEditMode ? "updated" : "created"
    }.`,
  };
}
