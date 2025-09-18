import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  dialect: "postgresql",
  out: "./lib/db/drizzle",
  extensionsFilters: ["postgis"],
  dbCredentials: {
    url: "postgresql://postgres:jJp1784%40x@localhost:5433/akili_energy",
  },
});