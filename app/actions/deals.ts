"use server";

import { db } from "@/lib/db/drizzle";
import { count, and, eq, sql, SQL } from "drizzle-orm";
import type {
  ActionState,
  AssetLifecycle,
  CompanySector,
  DealFilters,
  Pagination,
  ProjectSector,
  Sector,
  Technology,
} from "@/lib/types";
import {
  deals,
  dealsAssets,
  dealsCompanies,
  dealFinancials,
  mergersAcquisitions,
  financing,
  projectSector,
  companySector,
} from "@/lib/db/schema";
import { PgSelectBase, PgSelectWithout } from "drizzle-orm/pg-core";
import { parseLocation } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_PAGE_SIZE, TECHNOLOGIES_SECTORS } from "@/lib/constants";
import { z } from "zod";

function getSectors(sectors: { sector: Sector }[]) {
  return sectors.map((s) => s.sector);
}

function getTechnologies(technologies: { technology: Technology }[]) {
  return technologies.map((t) => t.technology);
}

export async function getDeals({
  filters,
  order,
  cursor,
  search,
  pageSize = DEFAULT_PAGE_SIZE,
}: {
  filters?: DealFilters;
  order?: Pagination;
  cursor?: Date;
  search?: string;
  pageSize?: number;
}) {
  try {
    const where: SQL[] = [];
    if (search) {
      where.push(
        sql`to_tsvector('franglais', ${deals.update}) @@ plainto_tsquery('franglais', ${search})`
      );
    }
    if (filters) {
      const { type, subtype } = filters;
      if (type) where.push(eq(deals.type, type));
      if (subtype) where.push(eq(deals.subtype, subtype));
    }
    let dealsCount:
      | PgSelectBase<any, any, any>
      | PgSelectWithout<any, any, any> = db
      .select({ count: count() })
      .from(deals);
    if (where.length > 0) dealsCount = dealsCount.where(and(...where));
    const [results, total] = await Promise.all([
      db.query.deals.findMany({
        columns: {
          id: true,
          update: true,
          type: true,
          subtype: true,
          amount: true,
          currency: true,
          date: true,
        },
        with: {
          dealsCountries: {
            columns: {},
            with: {
              country: {
                columns: {
                  code: true,
                  region: true,
                },
              },
            },
          },
          dealsAssets: {
            columns: {},
            with: {
              asset: {
                columns: {
                  id: true,
                  name: true,
                },
                with: {
                  projectsSectors: {
                    columns: {
                      sector: true,
                    },
                    where:
                      filters?.sector &&
                      projectSector.enumValues.includes(
                        filters.sector as ProjectSector
                      )
                        ? (projectsSectors, { eq }) =>
                            eq(
                              projectsSectors.sector,
                              filters.sector! as ProjectSector
                            )
                        : undefined,
                  },
                  projectsTechnologies: {
                    columns: {
                      technology: true,
                    },
                  },
                },
              },
            },
          },
          dealsCompanies: {
            columns: {},
            with: {
              company: {
                columns: {},
                with: {
                  companiesSectors: {
                    columns: {
                      sector: true,
                    },
                    where:
                      filters?.sector &&
                      companySector.enumValues.includes(
                        filters.sector as CompanySector
                      )
                        ? (companiesSectors, { eq }) =>
                            eq(
                              companiesSectors.sector,
                              filters.sector! as CompanySector
                            )
                        : undefined,
                  },
                  companiesTechnologies: {
                    columns: {
                      technology: true,
                    },
                  },
                },
              },
            },
          },
        },
        where: (deals, { gt, lt, or, and, eq }) =>
          and(
            ...[
              where.length ? and(...where) : undefined,
              cursor
                ? or(
                    order === "previous"
                      ? gt(deals.date, cursor)
                      : lt(deals.date, cursor),
                    and(
                      eq(deals.date, cursor),
                      order === "previous"
                        ? gt(deals.announcementDate, cursor)
                        : lt(deals.announcementDate, cursor)
                    )
                  )
                : undefined,
            ].filter(Boolean)
          ),
        orderBy: (deals, { asc, desc }) =>
          order === "previous"
            ? [asc(deals.date), asc(deals.announcementDate)]
            : [desc(deals.date), desc(deals.announcementDate)],
        limit: pageSize,
      }),
      dealsCount,
    ]);
    return {
      deals: results.map(
        ({ dealsCountries, dealsCompanies, dealsAssets, date, ...deal }) => {
          const isCorporate =
            deal.type === "merger_acquisition" &&
            deal.subtype === "ma_corporate";
          const sectors = [
            ...new Set(
              isCorporate
                ? dealsCompanies.flatMap((c) =>
                    getSectors(c.company.companiesSectors)
                  )
                : dealsAssets.flatMap((a) =>
                    getSectors(a.asset.projectsSectors)
                  )
            ),
          ];
          const companiesTechnologies = dealsCompanies.flatMap((c) =>
            getTechnologies(c.company.companiesTechnologies)
          );
          const technologies = [
            ...new Set(
              isCorporate
                ? companiesTechnologies
                : dealsAssets.flatMap((a) =>
                    getTechnologies(a.asset.projectsTechnologies)
                  )
            ),
          ];
          if (deal.type === "financing" && technologies.length === 0)
            technologies.push(...companiesTechnologies);
          return {
            ...deal,
            date: new Date(date),
            regions: [
              ...new Set(
                dealsCountries.map(({ country: { region } }) => region)
              ),
            ],
            countries: dealsCountries.map(({ country: { code } }) => code),
            sectors:
              sectors.length > 0
                ? sectors
                : technologies
                    .map((tech) => TECHNOLOGIES_SECTORS[tech]?.projectSector)
                    .filter(Boolean),
            assets: dealsAssets.map(({ asset: { id, name } }) => ({
              id,
              name,
            })),
          };
        }
      ),
      total: (total as { count: number }[])[0]?.count ?? 0,
    };
  } catch (error) {
    console.error("Error fetching deals:", error);
    throw new Error("Failed to fetch deals");
  }
}

export async function getDealById(id: string) {
  try {
    const result = await db.query.deals.findFirst({
      where: (deals, { eq }) => eq(deals.id, id),
      columns: {
        id: true,
        update: true,
        type: true,
        subtype: true,
        amount: true,
        currency: true,
        date: true,
        description: true,
        insights: true,
        impacts: true,
        announcementDate: true,
        completionDate: true,
        pressReleaseUrl: true,
        // onOffGrid: true,
      },
      with: {
        dealsCountries: {
          columns: {},
          with: {
            country: {
              columns: {
                code: true,
                region: true,
              },
            },
          },
        },
        dealsAssets: {
          columns: {
            maturity: true,
            equityTransactedPercentage: true,
          },
          with: {
            asset: {
              columns: {
                id: true,
                name: true,
                colocatedStorage: true,
                colocatedStorageCapacity: true,
                onOffGrid: true,
                subSectors: true,
                segments: true,
                country: true,
              },
              extras: (projects, { sql }) => ({
                capacity: sql<number>`${projects.plantCapacity}`.as("capacity"),
                lifecycle: sql<AssetLifecycle>`${projects.stage}`.as(
                  "lifecycle"
                ),
                location: sql<string>`ST_AsText(${projects.location})`.as(
                  "location"
                ),
              }),
              with: {
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
              },
            },
          },
        },
        dealsCompanies: {
          columns: {
            role: true,
            investorType: true,
            commitment: true,
          },
          with: {
            company: {
              columns: {
                id: true,
                name: true,
                classification: true,
                hqCountry: true,
                subSectors: true,
              },
              extras: (companies, { sql }) => ({
                location: sql<string>`ST_AsText(${companies.hqLocation})`.as(
                  "location"
                ),
              }),
              with: {
                companiesSectors: {
                  columns: {
                    sector: true,
                  },
                },
                companiesTechnologies: {
                  columns: {
                    technology: true,
                  },
                },
              },
            },
          },
        },
        mergerAcquisition: {
          columns: {
            status: true,
            revenueModel: true,
            revenueModelDuration: true,
            structure: true,
            specifics: true,
            financingStrategy: true,
            strategyRationale: true,
          },
          extras: (ma, { sql }) => ({
            revenueModelYears:
              sql<string>`coalesce(${ma.revenueModel} || ' (' || ${ma.revenueModelDuration} || ')', ${ma.revenueModel}::varchar, ${ma.revenueModelDuration}::varchar)`.as(
                "revenue_model_years"
              ),
          }),
        },
        financing: {
          columns: {
            vehicle: true,
            objective: true,
            financingType: true,
            financingSubtype: true,
          },
        },
        powerPurchaseAgreement: {},
        documents: {
          columns: {
            fileUrl: true,
            publisher: true,
            publishedAt: true,
          },
        },
        financials: {
          columns: {
            year: true,
            enterpriseValue: true,
            ebitda: true,
            debt: true,
            cash: true,
            revenue: true,
          },
          orderBy: (financials, { desc }) => [desc(financials.year)],
          limit: 1,
        },
      },
    });

    const isCorporate =
      result?.type === "merger_acquisition" &&
      result?.subtype === "ma_corporate";

    const onOffGrids = result?.dealsAssets.map((a) => a.asset.onOffGrid);

    const sectors = [
      ...new Set(
        isCorporate
          ? result?.dealsCompanies.flatMap((c) =>
              getSectors(c.company.companiesSectors)
            )
          : result?.dealsAssets.flatMap((a) =>
              getSectors(a.asset.projectsSectors)
            )
      ),
    ];
    const companiesTechnologies = result?.dealsCompanies.flatMap((c) =>
      getTechnologies(c.company.companiesTechnologies)
    ) ?? [];
    const technologies = [
      ...new Set(
        isCorporate
          ? companiesTechnologies
          : result?.dealsAssets.flatMap((a) =>
              getTechnologies(a.asset.projectsTechnologies)
            )
      ),
    ];
    if (result?.type === "financing" && technologies.length === 0)
      technologies.push(...companiesTechnologies);

    return result
      ? {
          ...result,
          onOffGrid: onOffGrids?.every((v) => v === false)
            ? true
            : onOffGrids?.every((v) => v === false)
            ? false
            : onOffGrids != null && onOffGrids.length > 0
            ? null
            : undefined,
          regions: [
            ...new Set(
              result?.dealsCountries.map(({ country: { region } }) => region)
            ),
          ],
          countries: result.dealsCountries.map(({ country: { code } }) => code),
          sectors:
              sectors.length > 0
                ? sectors
                : technologies
                    .map((tech) => TECHNOLOGIES_SECTORS[tech]?.projectSector)
                    .filter(Boolean),
          technologies,
          subSectors: [
            ...new Set(
              isCorporate
                ? result.dealsCompanies.flatMap((c) => c.company.subSectors)
                : result.dealsAssets.flatMap((a) => a.asset.subSectors)
            ),
          ],
          segments: [
            ...new Set(result.dealsAssets.flatMap((a) => a.asset.segments)),
          ],
          assets: result.dealsAssets.map(({ asset, ...dealAsset }) => ({
            ...dealAsset,
            ...asset,
          })),
          companies: result.dealsCompanies.map(
            ({ company, ...dealCompany }) => ({
              ...dealCompany,
              ...company,
            })
          ),
          locations: (isCorporate
            ? result.dealsCompanies.map((c) => ({
                name: c.company.name,
                position: parseLocation(c.company.location),
              }))
            : result.dealsAssets.map((a) => ({
                name: a.asset.name,
                position: parseLocation(a.asset.location),
              }))
          ).filter(
            ({ position }) =>
              position != null && !isNaN(position[0]) && !isNaN(position[1])
          ),
        }
      : null;
  } catch (error) {
    console.error("Error fetching deal by ID:", error);
    throw new Error("Failed to fetch deal");
  }
}

// Helper to convert empty strings to undefined for optional fields
const emptyStringToUndefined = z.literal("").transform(() => undefined);

// Zod schema for validation
const createDealSchema = z.object({
  update: z.string().min(5, "Deal title must be at least 5 characters long."),
  type: z.enum([
    "merger_acquisition",
    "financing",
    "power_purchase_agreement",
    "project_update",
    "joint_venture",
  ]),
  amount: z.preprocess(
    (val) => (val === "" ? undefined : parseFloat(String(val))),
    z.number().positive().optional()
  ),
  currency: z.string().default("USD"),
  pressReleaseUrl: z
    .union([
      emptyStringToUndefined,
      z.string().url("Please enter a valid URL."),
    ])
    .optional(),
  announcementDate: z.string().optional(),
  completionDate: z.string().optional(),
  summary: z.string().optional(),
  insights: z.string().optional(),
  impacts: z.string().optional(),

  // Dynamic Array Fields
  assetIds: z.array(z.string()).optional(),
  assetMaturities: z.array(z.string()).optional(),
  assetEquities: z
    .array(z.preprocess((val) => parseFloat(String(val)), z.number()))
    .optional(),

  companyIds: z.array(z.string()).optional(),
  companyRoles: z.array(z.string()).optional(),
  companyCommitments: z
    .array(z.preprocess((val) => parseFloat(String(val)), z.number()))
    .optional(),
  companyInvestorTypes: z.array(z.string()).optional(),

  // M&A specific
  structure: z.enum(["asset", "ma_corporate"]).optional(),
});

export async function upsertDeal(
  prevState: unknown,
  formData: FormData
): Promise<ActionState> {
  // 1. Reconstruct and Validate Data
  const data = {
    ...Object.fromEntries(formData.entries()),
    assetIds: formData.getAll("assetId"),
    assetMaturities: formData.getAll("assetMaturity"),
    assetEquities: formData.getAll("assetEquity"),
    companyIds: formData.getAll("companyId"),
    companyRoles: formData.getAll("companyRole"),
    companyCommitments: formData.getAll("companyCommitment"),
    companyInvestorTypes: formData.getAll("companyInvestorType"),
  };
  console.log(data);

  const validatedFields = createDealSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid form data. Please check the fields.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const {
    assetIds = [],
    assetMaturities = [],
    assetEquities = [],
    companyIds = [],
    companyRoles = [],
    companyCommitments = [],
    companyInvestorTypes = [],
    ...dealData
  } = validatedFields.data;

  try {
    // 2. Perform DB operations in a transaction
    const [newDeal] = await db.transaction(async (tx) => {
      const [deal] = await tx
        .insert(deals)
        .values({
          update: dealData.update,
          type: dealData.type,
          subtype:
            dealData.type === "merger_acquisition"
              ? dealData.structure
              : undefined,
          amount: dealData.amount,
          announcementDate: dealData.announcementDate || null,
          completionDate: dealData.completionDate || null,
          // ... other deal fields
        })
        .returning();

      if (assetIds.length > 0) {
        const assetsToInsert = assetIds.map((id, index) => ({
          dealId: deal.id,
          assetId: id,
          maturity: assetMaturities[index]
            ? parseInt(assetMaturities[index])
            : null,
          equityTransactedPercentage: assetEquities[index] || null,
        }));
        await tx.insert(dealsAssets).values(assetsToInsert);
      }

      if (companyIds.length > 0) {
        const companiesToInsert = companyIds.map((id, index) => ({
          dealId: deal.id,
          companyId: id,
          role: companyRoles[index],
          commitment: companyCommitments[index] || null,
          investorType: companyInvestorTypes[index] || null,
        }));
        await tx.insert(dealsCompanies).values(companiesToInsert);
      }

      // ... Handle M&A or Financing specific tables here if needed

      return [deal];
    });

    return { success: true, message: "" };
  } catch (error: any) {
    console.error("Error upserting deal:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred.",
    };
  }
}

// export async function upsertDeal({
//   formData,
//   assetEntries,
//   companyEntries,
//   financialEntries,
//   maData,
//   financingData,
// }: {
//   formData: any;
//   assetEntries: AssetEntry[];
//   companyEntries: CompanyEntry[];
//   financialEntries: FinancialEntry[];
//   maData: any;
//   financingData: any;
// }) {
//   try {
//     const [deal] = await db
//       .insert(deals)
//       .values({
//         ...formData,
//         amount: formData.amount ? parseFloat(formData.amount) : null,
//         type: formData.deal_type,
//         subtype:
//           formData.deal_type === "merger_acquisition"
//             ? maData.structure
//             : formData.subtype,
//       })
//       .returning();

//     const deal_id = deal.id;

//     if (assetEntries.length > 0) {
//       const assets = assetEntries.map((a) => ({
//         dealId: deal_id,
//         assetId: a.project_id,
//         maturity: a.maturity ? parseInt(a.maturity) : null,
//         equityTransactedPercentage: a.equity_transacted
//           ? parseFloat(a.equity_transacted)
//           : null,
//       }));
//       await db.insert(dealsAssets).values(assets);
//     }

//     if (companyEntries.length > 0) {
//       const companies = companyEntries.map((c) => ({
//         dealId: deal_id,
//         companyId: c.company_id,
//         role: "advisor",
//         commitment: c.commitment ? parseFloat(c.commitment) : null,
//         investorType: c.investor_type || null,
//       }));
//       await db.insert(dealsCompanies).values(companies);
//     }

//     if (financialEntries.length > 0) {
//       const financials = financialEntries.map((f) => ({
//         dealId: deal_id,
//         year: parseInt(f.year),
//         enterpriseValue: f.enterprise_value
//           ? parseFloat(f.enterprise_value)
//           : null,
//         ebitda: f.ebitda ? parseFloat(f.ebitda) : null,
//         debt: f.debt ? parseFloat(f.debt) : null,
//       }));
//       await db.insert(dealFinancials).values(financials);
//     }

//     if (formData.deal_type === "merger_acquisition") {
//       await db
//         .insert(mergersAcquisitions)
//         .values({ dealId: deal_id, ...maData, structure: "acquisition" });
//     } else if (formData.deal_type === "financing") {
//       await db.insert(financing).values({ dealId: deal_id, ...financingData });
//     }

//     return { success: true };
//   } catch (error: any) {
//     console.error("Error creating deal:", error);
//     throw new Error(error.message);
//   }
// }

export async function deleteDeal(id: string): Promise<ActionState> {
  const supabase = createClient();

  // Authenticate user and check permissions
  const {
    data: { user },
  } = await (await supabase).auth.getUser();
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
      .delete(deals)
      .where(eq(deals.id, id))
      .returning({ id: deals.id });

    if (deleted.length === 0) {
      return {
        success: false,
        message: `Deal #${id} not found.`,
      };
    }

    return {
      success: true,
      message: `Successfully deleted Deal #${id}".`,
    };
  } catch (error: any) {
    console.error(`Failed to delete Deal #${id}:`, error);
    return { success: false, message: `Error: ${error.message}` };
  }
}
