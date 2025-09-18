import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Disable prefetch as it is not supported for "Transaction" pool mode
// const client = postgres(process.env.DATABASE_URL!, { prepare: false })
const client = postgres(process.env.DATABASE_URL!);

export const db = drizzle({ client, casing: "snake_case", schema });
