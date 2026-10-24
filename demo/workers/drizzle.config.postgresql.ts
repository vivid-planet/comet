import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql",
    schema: "./api/db/schema.postgresql.ts",
    out: "./migrations/postgresql",
});
