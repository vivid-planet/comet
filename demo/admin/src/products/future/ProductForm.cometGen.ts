import { future_FormConfig as FormConfig } from "@comet/cms-admin";
import { GQLProduct } from "@src/graphql.generated";

export const ProductForm: FormConfig<GQLProduct> = {
    type: "form",
    gqlType: "Product",
    fragmentName: "ProductFormDetails", // configurable as it must be unique across project
    fields: [
        {
            type: "text",
            name: "title",
            label: "Titel", // default is generated from name (camelCaseToHumanReadable)
            required: true, // default is inferred from gql schema
        },
        { type: "text", name: "packageDimensions.height", label: "Height" },
        { type: "text", name: "slug" },
        { type: "text", name: "description", label: "Description", multiline: true },
        { type: "staticSelect", name: "type", label: "Type" /*, values: from gql schema (TODO overridable)*/ },
        //TODO { type: "asyncSelect", name: "category", label: "Category" /*, endpoint: from gql schema (overridable)*/ },
        { type: "number", name: "price" },
        { type: "boolean", name: "inStock" },
        { type: "date", name: "availableSince" },
        { type: "block", name: "image", label: "Image", block: { name: "PixelImageBlock", import: "@comet/cms-admin" } },
    ],
};

/*
TODO
export const tabsConfig: TabsConfig = {
    type: "tabs",
    tabs: [{ name: "form", content: formConfig }],
};

//alternative syntax for the above
export const tabsConfig2: TabsConfig = {
    type: "tabs",
    tabs: [
        {
            name: "form",
            content: {
                type: "form",
                gqlType: "Product",
                fields: [
                    { type: "text", name: "title", label: "Titel" },
                    { type: "text", name: "slug", label: "Slug" },
                    { type: "text", name: "description", label: "Description", multiline: true },
                    { type: "staticSelect", name: "type", label: "Type" / *, values: from gql schema (overridable)* / },
                    { type: "asyncSelect", name: "type", label: "Type" / *, endpoint: from gql schema (overridable)* / },
                    { type: "block", name: "image", label: "Image", block: PixelImageBlock },
                ],
            } satisfies FormConfig<GQLProduct>,
        },
    ],
};

*/
