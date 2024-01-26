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
        { type: "text", name: "slug" },
        { type: "text", name: "description", label: "Description", multiline: true },
        //TODO { type: "staticSelect", name: "type", label: "Type" /*, values: from gql schema (overridable)*/ },
        //TODO { type: "asyncSelect", name: "type", label: "Type" /*, endpoint: from gql schema (overridable)*/ },
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

/*
TODO
type GridColumnConfig<T> = ({ type: "text" } | { type: "number" }) & { name: keyof T; headerName?: string; width?: number };
type GridConfig<T extends { __typename?: string }> = { type: "form"; gqlType: T["__typename"]; columns: GridColumnConfig<T>[] };

export const gridConfig: GridConfig<GQLProduct> = {
    type: "grid",
    gqlType: "Product",
    columns: [
        { type: "text", name: "title", headerName: "Titel", width: 150 },
        { type: "text", name: "description", headerName: "Description", width: 150 },
        { type: "number", name: "price", headerName: "Price", width: 150 },
    ],
};
*/
