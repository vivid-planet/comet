import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "sqlite",
    schema: "./src/worker/db/schema.sqlite.ts",
    out: "./migrations/d1",
});
