import { defineConfig } from "../commands/generate/generate-command";
import { type GQLSample } from "../graphql.generated";

export default defineConfig<GQLSample>({
    type: "grid",
    gqlType: "Sample",
    columns: [{ type: "text", name: "sample" }],
});
