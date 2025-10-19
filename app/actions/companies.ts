"use server";

import { db } from "@/lib/db/drizzle";
import { count, and, eq, desc, asc, or, gt, lt, sql } from "drizzle-orm";
import { companies, companyPortfolios } from "@/lib/db/schema";
import type {
  CompanyFilters,
  Pagination,
  CompanySector,
  Country,
} from "@/lib/types";
import { parseLocation } from "@/lib/utils";

export async function getCompanies(
  filters?: CompanyFilters,
  order?: Pagination,
  cursor?: { createdAt: Date; id: string },
  search = "",
  pageSize = 12
) {
  try {
    const filterClauses = [];

    // Filter by classification (array contains)
    if (filters?.classification) {
      filterClauses.push(
        sql`${companies.classification} @> ARRAY[${filters.classification}]::company_classification[]`
      );
    }
    // Filter by HQ country
    if (filters?.country) {
      filterClauses.push(eq(companies.hqCountry, filters.country));
    }
    // Filter by operating status (array contains)
    if (filters?.status) {
      filterClauses.push(
        sql`${companies.operatingStatus} @> ARRAY[${filters.status}]::company_operating_status[]`
      );
    }
    // Filter by search term on company name
    if (search) {
      filterClauses.push(
        sql`to_tsvector('franglais', ${companies.name}) @@ plainto_tsquery('franglais', ${search})`
      );
    }

    const where = filterClauses.length > 0 ? and(...filterClauses) : undefined;

    // Clause for cursor-based pagination
    let cursorClause;
    if (cursor) {
      const op = order === "previous" ? gt : lt;
      cursorClause = or(
        op(companies.createdAt, cursor.createdAt),
        and(
          eq(companies.createdAt, cursor.createdAt),
          op(companies.id, cursor.id)
        )
      );
    }

    const finalWhere = and(...[where, cursorClause].filter(Boolean));

    const [results, totalResult] = await Promise.all([
      db.query.companies.findMany({
        columns: {
          id: true,
          name: true,
          description: true,
          classification: true,
          hqCountry: true,
          operatingStatus: true,
          foundingDate: true,
          size: true,
          logoUrl: true,
          createdAt: true,
        },
        with: {
          companiesSectors: {
            columns: { sector: true },
            where: filters?.sector
              ? (companiesSectors) =>
                  eq(companiesSectors.sector, filters.sector!)
              : undefined,
          },
          companiesOperatingCountries: {
            columns: { countryCode: true },
          },
        },
        where: finalWhere,
        orderBy:
          order === "previous"
            ? [asc(companies.createdAt), asc(companies.id)]
            : [desc(companies.createdAt), desc(companies.id)],
        limit: pageSize + 1,
      }),
      // Total count should ignore cursor for accurate total
      db.select({ count: count() }).from(companies).where(where),
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

    const formattedCompanies = results.map((company) => ({
      ...company,
      sectors: company.companiesSectors.map((s) => s.sector) as CompanySector[],
      operatingCountries: company.companiesOperatingCountries.map(
        (c) => c.countryCode
      ) as Country[],
    }));

    return {
      companies: formattedCompanies,
      total: totalResult[0]?.count ?? 0,
      nextCursor,
      prevCursor,
    };
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw new Error("Failed to fetch companies");
  }
}

export async function getCompanyById(id: string) {
  try {
    const companyQuery = db.query.companies.findFirst({
      where: (companies, { eq }) => eq(companies.id, id),
      columns: { hqLocation: false },
      with: {
        hqCountry: {
          columns: {
            code: true,
          },
        },
        companiesOperatingCountries: {
          with: {
            country: {
              columns: {
                code: true,
              },
            },
          },
        },
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
        companiesEmployees: {
          with: {
            employee: true,
          },
        },
        projectsCompanies: {
          columns: {
            role: true,
            equityAmount: true,
            percentageOwnership: true,
          },
          with: {
            project: {
              columns: {
                id: true,
                name: true,
                stage: true,
                plantCapacity: true,
                investmentCosts: true,
              },
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
              },
            },
          },
        },
        dealsCompanies: {
          columns: {
            role: true,
            investorType: true,
            commitment: true,
            equityTransactedPercentage: true,
          },
          with: {
            deal: {
              columns: {
                id: true,
                update: true,
                type: true,
                subtype: true,
                amount: true,
                date: true,
              },
              with: {
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
              },
            },
          },
        },
      },
      extras: (companies, { sql }) => ({
        location: sql<string>`ST_AsText(${companies.hqLocation})`.as(
          "location"
        ),
      }),
    });
    const portfolioQuery = db
      .select({
        total: companyPortfolios.totalPortfolio,
        inDevelopment: companyPortfolios.inDevelopmentPortfolio,
        inConstruction: companyPortfolios.inConstructionPortfolio,
        operational: companyPortfolios.operationalPortfolio,
      })
      .from(companyPortfolios)
      .where(eq(companyPortfolios.companyId, id))
      .limit(1);

    const [companyData, portfolio] = await Promise.all([
      companyQuery,
      portfolioQuery,
    ]);

    if (!companyData) {
      return null;
    }

    const {
      projectsCompanies,
      dealsCompanies,
      companiesSectors,
      companiesOperatingCountries,
      companiesEmployees,
      companiesTechnologies,
      hqCountry,
      location,
      ...company
    } = companyData;

    // 4. Construct the final company object
    return {
      sectors: companiesSectors.map((s) => s.sector),
      technologies: companiesTechnologies.map((t) => t.technology),
      hqCountry: hqCountry?.code,
      operatingCountries: companiesOperatingCountries.map(
        (c) => c.country.code
      ),
      location: parseLocation(location),
      team: companiesEmployees.map((ce) => ce.employee),
      projects: projectsCompanies.map(
        ({
          project: { country, projectsSectors, ...project },
          ...roleInfo
        }) => ({
          sectors: projectsSectors.map((s) => s.sector),
          region: country?.region,
          country: country?.code,
          ...roleInfo,
          ...project,
        })
      ),
      deals: dealsCompanies.map(
        ({ deal: { dealsCountries, ...deal }, ...roleInfo }) => ({
          sectors: [], // Note: Simplified for this context. A deeper join would be needed for deal sectors.
          region: dealsCountries[0]?.country.region,
          country: dealsCountries.map((dc) => dc.country.code),
          ...roleInfo,
          ...deal,
        })
      ),
      portfolio: portfolio[0] || null,
      ...company,
    };
  } catch (error) {
    console.error("Error fetching company by ID:", error);
    throw new Error("Failed to fetch company details.");
  }
}
