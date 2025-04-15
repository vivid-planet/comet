import { defineConfig } from "@comet/admin-generator";
import { DamImageBlock } from "@comet/cms-admin";
import { type GQLProduct } from "@src/graphql.generated";

export default defineConfig<GQLProduct>({
    type: "form",
    gqlType: "Product",
    fragmentName: "StaticSelectInputTypeSelect",
    mode: "all",
    fields: [
        {
            type: "fieldSet",
            name: "Tenant",
            collapsible: true,
            initiallyExpanded: true,
            fields: [
                {
                    type: "block",
                    name: "image",
                    label: "Image",
                    block: DamImageBlock,
                },
                {
                    type: "text",
                    name: "description",
                },
                {
                    type: "staticSelect",
                    name: "status",
                },
            ],
        },
    ],
});
