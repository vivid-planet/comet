import { type future_FormConfig as FormConfig } from "@comet/cms-admin";
import { type GQLProduct } from "@src/graphql.generated";

export const ProductPriceForm: FormConfig<GQLProduct> = {
    type: "form",
    gqlType: "Product",
    mode: "edit",
    fragmentName: "ProductPriceFormDetails", // configurable as it must be unique across project
    fields: [{ type: "number", name: "price", helperText: "Enter price in this format: 123,45", startAdornment: "€" }],
};
