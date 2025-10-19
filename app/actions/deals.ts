"use server";

import { db } from "@/lib/db/drizzle";
import { count, and, eq } from "drizzle-orm";
import type {
  AssetLifecycle,
  DealFilters,
  Pagination,
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
} from "@/lib/db/schema";
import { PgSelectBase, PgSelectWithout } from "drizzle-orm/pg-core";
import { parseLocation } from "@/lib/utils";

function getSectors(sectors: { sector: Sector }[]) {
  return sectors.map((s) => s.sector);
}

function getTechnologies(technologies: { technology: Technology }[]) {
  return technologies.map((t) => t.technology);
}


export async function getDeals(
  filters?: DealFilters,
  order?: Pagination,
  cursor?: Date,
  search = "",
  pageSize = 10
) {
  try {
    const where =
      filters && Object.values(filters).some((v) => v !== undefined)
        ? and(
            ...Object.entries(filters)
              .filter(([v]) => v !== undefined)
              .map(([k, v]) => eq(deals[k as keyof Omit<DealFilters, "dateRange">], v as any))
          )
        : undefined;
    let dealsCount:
      | PgSelectBase<any, any, any>
      | PgSelectWithout<any, any, any> = db
      .select({ count: count() })
      .from(deals);
    if (where) dealsCount = dealsCount.where(where);
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
                  },
                },
              },
            },
          },
        },
        where: (deals, { gt, lt, or, and, eq }) =>
          and(
            ...[
              where,
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
        ({ dealsCountries, dealsCompanies, dealsAssets, date, ...deal }) => ({
          ...deal,
          date: new Date(date),
          regions: [
            ...new Set(dealsCountries.map(({ country: { region } }) => region)),
          ],
          countries: dealsCountries.map(({ country: { code } }) => code),
          sectors: [
            ...new Set(
              (deal.type === "merger_acquisition" &&
                deal.subtype === "ma_corporate") ||
              deal.type === "financing"
                ? dealsCompanies.flatMap((c) =>
                    getSectors(c.company.companiesSectors)
                  )
                : dealsAssets.flatMap((a) =>
                    getSectors(a.asset.projectsSectors)
                  )
            ),
          ],
          assets: dealsAssets.map(({ asset: { id, name } }) => ({ id, name })),
        })
      ),
      total: (total as {count: number}[])[0]?.count ?? 0,
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
      (result?.type === "merger_acquisition" &&
        result?.subtype === "ma_corporate") ||
      result?.type === "financing";

    const onOffGrids = result?.dealsAssets.map((a) => a.asset.onOffGrid);

    return result
      ? {
          ...result,
          onOffGrid: onOffGrids?.every((v) => v === false)
            ? true
            : onOffGrids?.every((v) => v === false)
            ? false : onOffGrids != null && onOffGrids.length > 0
            ? null
            : undefined,
          regions: [
            ...new Set(
              result?.dealsCountries.map(({ country: { region } }) => region)
            ),
          ],
          countries: result.dealsCountries.map(({ country: { code } }) => code),
          sectors: [
            ...new Set(
              isCorporate
                ? result.dealsCompanies.flatMap((c) =>
                    getSectors(c.company.companiesSectors)
                  )
                : result.dealsAssets.flatMap((a) =>
                    getSectors(a.asset.projectsSectors)
                  )
            ),
          ],
          technologies: [
            ...new Set(
              isCorporate
                ? result.dealsCompanies.flatMap((c) =>
                    getTechnologies(c.company.companiesTechnologies)
                  )
                : result.dealsAssets.flatMap((a) =>
                    getTechnologies(a.asset.projectsTechnologies)
                  )
            ),
          ],
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

interface AssetEntry {
  id: string;
  project_id: string;
  project_name: string;
  maturity: string;
  equity_transacted: string;
}

interface CompanyEntry {
  id: string;
  company_id: string;
  role: string;
  commitment: string;
  investor_type: string;
}

interface FinancialEntry {
  id: string;
  year: string;
  enterprise_value: string;
  ebitda: string;
  debt: string;
}

export async function createDeal({
  formData,
  assetEntries,
  companyEntries,
  financialEntries,
  maData,
  financingData,
}: {
  formData: any;
  assetEntries: AssetEntry[];
  companyEntries: CompanyEntry[];
  financialEntries: FinancialEntry[];
  maData: any;
  financingData: any;
}) {
  try {
    const [deal] = await db
      .insert(deals)
      .values({
        ...formData,
        amount: formData.amount ? parseFloat(formData.amount) : null,
        type: formData.deal_type,
        subtype:
          formData.deal_type === "merger_acquisition"
            ? maData.structure
            : formData.subtype,
      })
      .returning();

    const deal_id = deal.id;

    if (assetEntries.length > 0) {
      const assets = assetEntries.map((a) => ({
        dealId: deal_id,
        assetId: a.project_id,
        maturity: a.maturity ? parseInt(a.maturity) : null,
        equityTransactedPercentage: a.equity_transacted
          ? parseFloat(a.equity_transacted)
          : null,
      }));
      await db.insert(dealsAssets).values(assets);
    }

    if (companyEntries.length > 0) {
      const companies = companyEntries.map((c) => ({
        dealId: deal_id,
        companyId: c.company_id,
        role: "advisor",
        commitment: c.commitment ? parseFloat(c.commitment) : null,
        investorType: c.investor_type || null,
      }));
      await db.insert(dealsCompanies).values(companies);
    }

    if (financialEntries.length > 0) {
      const financials = financialEntries.map((f) => ({
        dealId: deal_id,
        year: parseInt(f.year),
        enterpriseValue: f.enterprise_value
          ? parseFloat(f.enterprise_value)
          : null,
        ebitda: f.ebitda ? parseFloat(f.ebitda) : null,
        debt: f.debt ? parseFloat(f.debt) : null,
      }));
      await db.insert(dealFinancials).values(financials);
    }

    if (formData.deal_type === "merger_acquisition") {
      await db
        .insert(mergersAcquisitions)
        .values({ dealId: deal_id, ...maData, structure: "acquisition" });
    } else if (formData.deal_type === "financing") {
      await db.insert(financing).values({ dealId: deal_id, ...financingData });
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error creating deal:", error);
    throw new Error(error.message);
  }
}
