"use server";

import { db } from "@/lib/db/drizzle";
import { count, and, eq, sql, SQL } from "drizzle-orm";
import type {
  ActionState,
  AssetLifecycle,
  CompanySector,
  DealFilters,
  DealFinancingType,
  MASpecifics,
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
  dealType,
  dealSubtype,
  countryCode,
  technology,
  powerPurchaseAgreements,
  segment,
  dealCompanyRole,
  financingInvestorType,
  dealFinancingType,
  maSpecifics,
  maStructure,
  revenueModel,
  financingObjective,
  financingSubtype,
} from "@/lib/db/schema";
import { PgSelectBase, PgSelectWithout } from "drizzle-orm/pg-core";
import { parseLocation } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import {
  DEFAULT_PAGE_SIZE,
  SECTORS,
  SUB_SECTORS,
  TECHNOLOGIES_SECTORS,
} from "@/lib/constants";
import z from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { getUserRole } from "./auth";

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
  let redirectPath: string | undefined;
  try {
    const userRole = await getUserRole();
    if (userRole === null || userRole === undefined) {
      console.log("User role not found, redirecting to login.");
      redirectPath = "/login";
    }
    const isGuestUser = userRole === "guest";

    const where: SQL[] = [];
    if (search && !isGuestUser) {
      where.push(
        sql`to_tsvector('franglais', ${deals.update}) @@ plainto_tsquery('franglais', ${search})`
      );
    }
    if (filters && !isGuestUser) {
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
                      ) &&
                      !isGuestUser
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
                      ) &&
                      !isGuestUser
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
          isGuestUser
            ? undefined
            : and(
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
        limit: isGuestUser ? DEFAULT_PAGE_SIZE : pageSize,
      }),
      dealsCount,
    ]);
    const totalDeals = (total as { count: number }[])[0]?.count ?? 0;
    if (!redirectPath) {
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
        total: isGuestUser
          ? Math.min(DEFAULT_PAGE_SIZE, totalDeals)
          : totalDeals,
      };
    }
  } catch (error) {
    console.error("Error fetching deals:", error);
    throw new Error("Failed to fetch deals");
  } finally {
    if (redirectPath) {
      redirect(redirectPath!);
    }
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
    const companiesTechnologies =
      result?.dealsCompanies.flatMap((c) =>
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

// Helper to transform empty strings from FormData into undefined for optional fields
const emptyStringToUndefined = z.literal("").transform(() => undefined);

// Unified Zod schema for both creating and editing a deal
const upsertDealSchema = z
  .object({
    dealId: z.string().uuid().optional(),
    update: z.string().min(1, "Deal update is required"),
    type: z.enum(dealType.enumValues),
    subtype: z.enum(dealSubtype.enumValues),
    amount: z.coerce.number().positive().optional(),
    dealDate: z.coerce.date().optional(),
    announcementDate: z.coerce.date().optional(),
    completionDate: z.coerce.date().optional(),
    description: z.string().optional(),
    impacts: z.string().optional(),
    insights: z.string().optional(),
    pressReleaseUrl: z.url().optional().or(z.literal("")),

    // Arrays
    countries: z.array(z.enum(countryCode.enumValues)).optional(),
    sectors: z.array(z.enum(SECTORS)).optional(),
    technologies: z.array(z.enum(technology.enumValues)).optional(),
    subSectors: z.array(z.enum(SUB_SECTORS)).optional(),
    segments: z.array(z.enum(segment.enumValues)).optional(),

    // Assets (multiple)
    assetId: z.array(z.uuid()).optional(),
    assetMaturity: z.array(z.coerce.number().int().positive()).optional(),
    assetEquity: z.array(z.coerce.number().min(0).max(100)).optional(),

    // Companies (multiple)
    companyId: z.array(z.uuid()).optional(),
    companyRole: z.array(z.enum(dealCompanyRole.enumValues)).optional(),
    companyCommitment: z.array(z.coerce.number().positive()).optional(),
    companyInvestorType: z
      .array(z.enum(financingInvestorType.enumValues))
      .optional(),
    companyEquityTransacted: z
      .array(z.coerce.number().min(0).max(100))
      .optional(),
    companyDetails: z.array(z.string()).optional(),

    // Financials (multiple years)
    financialYear: z.array(z.coerce.number().int().min(2000)).optional(),
    financialEnterpriseValue: z.array(z.coerce.number().positive()).optional(),
    financialEbitda: z.array(z.coerce.number()).optional(),
    financialDebt: z.array(z.coerce.number().positive()).optional(),
    financialRevenue: z.array(z.coerce.number()).optional(),
    financialCash: z.array(z.coerce.number().positive()).optional(),

    // M&A
    maStructure: z.enum(maStructure.enumValues).optional(),
    maSpecifics: z.array(z.enum(maSpecifics.enumValues)).optional(),
    maFinancingStrategy: z
      .array(z.enum(dealFinancingType.enumValues))
      .optional(),
    revenueModel: z.enum(revenueModel.enumValues).optional(),
    revenueModelDuration: z.coerce.number().int().positive().optional(),
    maStrategyRationale: z.string().optional(),

    // Financing
    financingVehicle: z.string().optional(),
    financingObjective: z.enum(financingObjective.enumValues).optional(),
    financingType: z.array(z.enum(dealFinancingType.enumValues)).optional(),
    financingSubtype: z.array(z.enum(financingSubtype.enumValues)).optional(),

    // PPA
    ppaSpecific: z.coerce.boolean().optional(),
    ppaDuration: z.coerce.number().int().positive().optional(),
    ppaCapacity: z.coerce.number().positive().optional(),
    ppaGeneratedPower: z.coerce.number().positive().optional(),
    onOffsite: z.coerce.boolean().optional(),
    ppaSupplyStart: z.coerce.date().optional(),
    assetOperationalDate: z.coerce.date().optional(),
  })
  .superRefine((data, ctx) => {
    // Validate financing deals have amount
    if (data.type === "financing" && !data.amount) {
      ctx.addIssue({
        code: "custom",
        message: "Amount is required for financing deals",
        path: ["amount"],
      });
    }

    // Validate array lengths match
    const assetLength = data.assetId?.length ?? 0;
    if (data.assetMaturity && data.assetMaturity.length !== assetLength) {
      ctx.addIssue({
        code: "custom",
        message: "Assets count mismatch",
        path: ["assetId"],
      });
    }

    const companyLength = data.companyId?.length ?? 0;
    if (data.companyRole && data.companyRole.length !== companyLength) {
      ctx.addIssue({
        code: "custom",
        message: "Companies count mismatch",
        path: ["companyRole"],
      });
    }

    const financialLength = data.financialYear?.length ?? 0;
    if (
      data.financialEbitda &&
      data.financialEbitda.length !== financialLength
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Financial data length mismatch",
        path: ["financialEbitda"],
      });
    }
  });

export async function upsertDeal(
  prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  try {
    // 1. Reconstruct data from FormData for validation
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = upsertDealSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Invalid form data.",
        errors: z.flattenError(validatedData.error).fieldErrors,
      };
    }

    const { data } = validatedData;
    const isEditMode = !!data.dealId;

    const [result] = await db.transaction(async (tx) => {
      let dealId: string;
      const dealData = {
        update: data.update,
        type: data.type,
        subtype: data.subtype,
        amount: data.amount ?? null,
        date: data.dealDate,
        description: data.description ?? null,
        impacts: data.impacts ?? null,
        insights: data.insights ?? null,
        pressReleaseUrl: data.pressReleaseUrl || null,
        announcementDate: data.announcementDate ?? null,
        completionDate: data.completionDate ?? null,
      };
      // 2. Upsert the main 'deals' table
      if (isEditMode) {
        const [updatedDeal] = await tx
          .update(deals)
          .set(dealData)
          .where(eq(deals.id, data.dealId!))
          .returning({ id: deals.id });
        if (!updatedDeal) throw new Error("Deal not found for update.");
        dealId = updatedDeal.id;
      } else {
        const [newDeal] = await tx
          .insert(deals)
          .values(dealData)
          .returning({ id: deals.id });
        dealId = newDeal.id;
      }

      // 3. Handle relational data: Delete existing and insert new
      if (isEditMode) {
        await tx.delete(dealsAssets).where(eq(dealsAssets.dealId, dealId));
        await tx
          .delete(dealsCompanies)
          .where(eq(dealsCompanies.dealId, dealId));
        await tx
          .delete(dealFinancials)
          .where(eq(dealFinancials.dealId, dealId));
      }

      if (data.assetId && data.assetId.length > 0) {
        const assetsToInsert = d.assetId.map((id, i) => ({
          dealId: dealId,
          assetId: id,
          maturity: d.assetMaturity?.[i] ? parseInt(d.assetMaturity[i]) : null,
          equityTransactedPercentage: d.assetEquity?.[i]
            ? parseFloat(d.assetEquity[i])
            : null,
        }));
        await tx.insert(dealsAssets).values(assetsToInsert);
      }

      if (d.companyId && d.companyId.length > 0) {
        const companiesToInsert = d.companyId.map((id, i) => ({
          dealId: dealId,
          companyId: id,
          role: d.companyRole?.[i] || "advisor",
          commitment: d.companyCommitment?.[i]
            ? parseFloat(d.companyCommitment[i])
            : null,
          investorType: d.companyInvestorType?.[i] || null,
        }));
        await tx.insert(dealsCompanies).values(companiesToInsert);
      }

      if (d.financialYear && d.financialYear.length > 0) {
        const financialsToInsert = d.financialYear.map((year, i) => ({
          dealId: dealId,
          year: parseInt(year),
          enterpriseValue: d.financialEnterpriseValue?.[i]
            ? parseFloat(d.financialEnterpriseValue[i])
            : null,
          ebitda: d.financialEbitda?.[i]
            ? parseFloat(d.financialEbitda[i])
            : null,
          debt: d.financialDebt?.[i] ? parseFloat(d.financialDebt[i]) : null,
        }));
        await tx.insert(dealFinancials).values(financialsToInsert);
      }

      // 4. Handle sub-deal tables
      if (d.type === "merger_acquisition") {
        await tx
          .insert(mergersAcquisitions)
          .values({
            dealId: dealId,
            structure: d.maStructure as any,
            specifics: d.maSpecifics?.split(",") as any,
            financingStrategy: d.maFinancingStrategy?.split(",") as any,
            strategyRationale: d.maStrategyRationale,
          })
          .onConflictDoUpdate({
            target: mergersAcquisitions.dealId,
            set: {
              structure: d.maStructure as any,
              specifics: d.maSpecifics?.split(",") as any,
              financingStrategy: d.maFinancingStrategy?.split(",") as any,
              strategyRationale: d.maStrategyRationale,
            },
          });
      } else if (d.type === "financing") {
        await tx
          .insert(financing)
          .values({
            dealId: dealId,
            vehicle: d.financingVehicle,
            objective: d.financingObjective as any,
            financingType: d.financingType?.split(",") as any,
            financingSubtype: d.financingSubtype?.split(",") as any,
          })
          .onConflictDoUpdate({
            target: financing.dealId,
            set: {
              vehicle: d.financingVehicle,
              objective: d.financingObjective as any,
              financingType: d.financingType?.split(",") as any,
              financingSubtype: d.financingSubtype?.split(",") as any,
            },
          });
      } else if (d.type === "power_purchase_agreement") {
        await tx
          .insert(powerPurchaseAgreements)
          .values({
            dealId: dealId,
            details: d.ppaSpecific === "true",
            duration: d.ppaDuration ? parseInt(d.ppaDuration) : null,
            capacity: d.ppaCapacity ? parseFloat(d.ppaCapacity) : null,
            generatedPower: d.ppaGeneratedPower
              ? parseFloat(d.ppaGeneratedPower)
              : null,
            onOffSite: d.onOffsite === "true",
            supplyStart: d.ppaSupplyStart || null,
          })
          .onConflictDoUpdate({
            target: powerPurchaseAgreements.dealId,
            set: {
              details: d.ppaSpecific === "true",
              duration: d.ppaDuration ? parseInt(d.ppaDuration) : null,
              capacity: d.ppaCapacity ? parseFloat(d.ppaCapacity) : null,
              generatedPower: d.ppaGeneratedPower
                ? parseFloat(d.ppaGeneratedPower)
                : null,
              onOffSite: d.onOffsite === "true",
              supplyStart: d.ppaSupplyStart || null,
            },
          });
      }

      return [{ id: dealId }];
    });

    // 5. Revalidate and redirect
    revalidatePath("/admin/deals");
    redirect(`/admin/deals`);
  } catch (error: any) {
    console.error("Failed to upsert deal:", error);
    return {
      success: false,
      message: error.message || "An unexpected database error occurred.",
    };
  }
}

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
