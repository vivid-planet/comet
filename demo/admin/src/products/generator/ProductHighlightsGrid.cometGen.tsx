import { defineConfig } from "@comet/admin-generator";
import { type GQLProductHighlight } from "@src/graphql.generated";

export default defineConfig<GQLProductHighlight>({
    type: "grid",
    gqlType: "ProductHighlight",
    columns: [{ type: "text", name: "description", headerName: "Description" }],
});
