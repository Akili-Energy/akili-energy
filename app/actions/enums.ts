"use server";
import { db } from "@/lib/db/drizzle";

export async function getCountriesRegions() {
  const results = await db.query.countries.findMany({
    columns: { region: true, code: true },
  });
  return results.reduce<
    Partial<
      Record<
        (typeof results)[number]["region"],
        Array<(typeof results)[number]["code"]>
      >
    >
  >(
    (acc, { region, code }) => ({
      ...acc,
      [region]: [...(acc[region] || []), code],
    }),
    {}
  );
}

export async function getTechnologiesSectors() {
  const results = await db.query.technologies.findMany({
    columns: { sector: true, id: true },
    where: (t, { isNotNull }) => isNotNull(t.sector),
  });
  return results.reduce<
    Partial<
      Record<
        NonNullable<(typeof results)[number]["sector"]>,
        Array<(typeof results)[number]["id"]>
      >
    >
  >(
    (acc, { sector, id }) => ({
      ...acc,
      [sector!]: [...(acc[sector!] || []), id],
    }),
    {}
  );
}
