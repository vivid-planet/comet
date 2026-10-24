import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "sqlite",
    schema: "./api/db/schema.sqlite.ts",
    out: "./migrations/d1",
});
