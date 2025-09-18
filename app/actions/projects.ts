"use server";

import { db } from "@/lib/db/drizzle";
import { dealsAssets } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getProjects() {
  try {
    const results = await db.query.projects.findMany({
      columns: {
        id: true,
        name: true,
        stage: true,
        plantCapacity: true,
        investmentCosts: true,
      },
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
          columns: {},
          with: {
            sector: {
              columns: { id: true },
            },
          },
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
    });

    return results.map(
      ({
        country,
        projectsSectors,
        projectsCompanies,
        details,
        location,
        ...project
      }) => {
        let parsedLocation: [number, number] | null = null;
        if (location) {
          const match = location.match(
            /POINT\(([-\d.]+) ([-\d.]+)\)/
          );
          if (match) {
            parsedLocation = [parseFloat(match[2]), parseFloat(match[1])];
          }
        }

        return {
          ...project,
          location: parsedLocation,
          sponsor: projectsCompanies[0]?.company.name ?? "N/A",
          country: country ? country.code : null,
          region: country?.region,
          date: details?.operationalDate
            ? new Date(details.operationalDate).toLocaleDateString()
            : "",
          sectors: projectsSectors.map(({ sector }) => sector.id),
        };
      }
    );
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error("Failed to fetch projects");
  }
}

export async function getProjectById(id: string) {
  try {
    const result = await db.query.projects.findFirst({
      where: (projects, { eq }) => eq(projects.id, id),
      with: {
        country: true,
        projectsSectors: { with: { sector: true } },
        projectsTechnologies: { with: { technology: true } },
        projectsCompanies: { with: { company: true } },
        details: true,
        proposal: true,
      },
    });

    if (!result) return null;

    // Fetch related deals where this project is an asset
    const relatedDeals = await db.query.deals.findMany({
      where: (deals, { inArray }) =>
        inArray(
          deals.id,
          db
            .select({ dealId: dealsAssets.dealId })
            .from(dealsAssets)
            .where(eq(dealsAssets.assetId, id))
        ),
      columns: {
        id: true,
        update: true,
        type: true,
        date: true,
      },
    });

    return {
      ...result,
      sectors: result.projectsSectors.map((ps) => ps.sector.id),
      technologies: result.projectsTechnologies.map((pt) => pt.technology.id),
      companies: result.projectsCompanies,
      relatedDeals,
    };
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    throw new Error("Failed to fetch project");
  }
}
