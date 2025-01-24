import { future_FormConfig as FormConfig } from "@comet/cms-admin";
import { GQLProduct } from "@src/graphql.generated";

export const ProductForm: FormConfig<GQLProduct> = {
    type: "form",
    gqlType: "Product",
    fragmentName: "ProductFormDetails", // configurable as it must be unique across project
    fields: [
        {
            type: "fieldSet",
            name: "mainData",
            supportText: "Product: {title}",
            collapsible: false,
            initiallyExpanded: true,
            fields: [
                {
                    type: "text",
                    name: "title",
                    label: "Titel", // default is generated from name (camelCaseToHumanReadable)
                    required: true, // default is inferred from gql schema
                    validate: { name: "validateTitle", import: "./validateTitle" },
                },
                { type: "text", name: "slug" },
                { type: "date", name: "createdAt", label: "Created", readOnly: true },
                { type: "text", name: "description", label: "Description", multiline: true },
                {
                    type: "staticSelect",
                    name: "type",
                    label: "Type",
                    required: true,
                    inputType: "radio",
                    values: [{ value: "Cap", label: "great Cap" }, "Shirt", "Tie"],
                },
                { type: "asyncSelect", name: "category", rootQuery: "productCategories" },
                {
                    type: "numberRange",
                    name: "priceRange",
                    minValue: 25,
                    maxValue: 500,
                    disableSlider: true,
                    startAdornment: "€",
                },
                {
                    type: "optionalNestedFields",
                    name: "dimensions",
                    checkboxLabel: "Configure dimensions",
                    fields: [
                        { type: "number", name: "width", label: "Width" },
                        { type: "number", name: "height", label: "Height" },
                        { type: "number", name: "depth", label: "Depth" },
                    ],
                },
            ],
        },
        {
            type: "fieldSet",
            name: "additionalData",
            fields: [
                {
                    type: "asyncSelect",
                    name: "manufacturer",
                    rootQuery: "manufacturers",
                    filterField: {
                        name: "type",
                        gqlName: "addressAsEmbeddable_country",
                    },
                    startAdornment: { icon: "Location" },
                },
                { type: "boolean", name: "inStock" },
                { type: "date", name: "availableSince", startAdornment: { icon: "CalendarToday" } },
                { type: "component", component: { name: "FutureProductNotice", import: "../../helpers/FutureProductNotice" } },
                { type: "block", name: "image", label: "Image", block: { name: "DamImageBlock", import: "@comet/cms-admin" } },
                { type: "fileUpload", name: "priceList", label: "Price List", maxFileSize: 1024 * 1024 * 4, download: true },
                { type: "fileUpload", name: "datasheets", label: "Datasheets", multiple: true, maxFileSize: 1024 * 1024 * 4, download: false },
                { type: "dateTime", name: "lastCheckedAt", label: "Last checked at" },
            ],
        },
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
