import { defineConfig } from "@comet/admin-generator";
import { type GQLProduct } from "@src/graphql.generated";
import { FormattedMessage } from "react-intl";

import { FutureProductNotice } from "../helpers/FutureProductNotice";
import { productTypeValues } from "./productTypeValues";

export default defineConfig<GQLProduct>({
    type: "form",
    gqlType: "Product",
    fragmentName: "ProductFormDetails", // configurable as it must be unique across project
    navigateOnCreate: false,
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
                    validate: (value: string) =>
                        value.length < 3 ? (
                            <FormattedMessage id="product.validate.titleMustBe3CharsLog" defaultMessage="Title must be at least 3 characters long" />
                        ) : undefined,
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
                    values: productTypeValues,
                },
                { type: "staticSelect", name: "additionalTypes" },
                { type: "asyncSelect", name: "category", rootQuery: "productCategories" },
                { type: "asyncSelect", name: "tags", rootQuery: "productTags" },
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
                    filter: {
                        type: "formProp",
                        propName: "manufacturerCountry",
                        rootQueryArg: "addressAsEmbeddable_country",
                    },
                    startAdornment: { icon: "Location" },
                },
                { type: "boolean", name: "inStock" },
                { type: "date", name: "availableSince", startAdornment: { icon: "CalendarToday" } },
                { type: "component", component: FutureProductNotice },
                { type: "fileUpload", name: "image", label: "Image", maxFileSize: 1024 * 1024 * 4, download: true },
                { type: "fileUpload", name: "priceList", label: "Price List", maxFileSize: 1024 * 1024 * 4, download: true },
                { type: "fileUpload", name: "datasheets", label: "Datasheets", multiple: true, maxFileSize: 1024 * 1024 * 4, download: false },
                { type: "dateTime", name: "lastCheckedAt", label: "Last checked at" },
            ],
        },
    ],
});

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
