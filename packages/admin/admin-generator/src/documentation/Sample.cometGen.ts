import { type GridConfig } from "../commands/generate/generate-command";
import { type GQLSample } from "../graphql.generated";

export const SampleGrid: GridConfig<GQLSample> = {
    type: "grid",
    gqlType: "Sample",
    columns: [{ type: "text", name: "sample" }],
};
