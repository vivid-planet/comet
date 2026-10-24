import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/worker/db/schema.postgresql.ts",
    out: "./migrations/postgresql",
});
