import { future_FormConfig as FormConfig } from "@comet/cms-admin";
import { GQLProductCategory } from "@src/graphql.generated";

export const ProductCategoryForm: FormConfig<GQLProductCategory> = {
    type: "form",
    gqlType: "ProductCategory",
    fragmentName: "ProductCategoryFormDetails",
    fields: [
        { type: "text", name: "title" },
        { type: "text", name: "slug" },
    ],
};
