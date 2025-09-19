import './envConfig.ts';
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  dialect: "postgresql",
  out: "./lib/db/drizzle",
  extensionsFilters: ["postgis"],
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});