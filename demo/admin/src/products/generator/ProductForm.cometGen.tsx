import { gql } from "@apollo/client";
import { defineConfig, type InjectedFormVariables, injectFormVariables } from "@comet/admin-generator";
import { DamImageBlock } from "@comet/cms-admin";
import { type GQLProduct } from "@src/graphql.generated";
import { FORM_ERROR } from "final-form";
import { FormattedMessage } from "react-intl";

import { FutureProductNotice } from "../helpers/FutureProductNotice";
import { type FormValues } from "./generated/ProductForm";
import { type GQLValidateProductQuery, type GQLValidateProductQueryVariables } from "./ProductForm.cometGen.generated";
import { productTypeValues } from "./productTypeValues";
import { validateProductSlug } from "./validateProductSlug";

export default defineConfig<GQLProduct>({
    type: "form",
    gqlType: "Product",
    fragmentName: "ProductFormDetails", // configurable as it must be unique across project
    navigateOnCreate: false,

    validate: injectFormVariables(({ client }: InjectedFormVariables) => async (formValues: FormValues) => {
        // this just demonstrates record level validation via api call, in real world scenario this could be done as client side field validation
        const validateResponse = await client.query<GQLValidateProductQuery, GQLValidateProductQueryVariables>({
            query: gql`
                query ValidateProduct($input: ValidateProductInput!) {
                    validateProduct(input: $input) {
                        ok
                        errorCode
                    }
                }
            `,
            variables: { input: { title: formValues.title } },
        });
        const validationResult = validateResponse.data.validateProduct;
        if (!validationResult.ok) {
            if (validationResult.errorCode === "TITLE_TOO_SHORT") {
                return {
                    title: <FormattedMessage id="product.validate.titleMustBe3CharsLog" defaultMessage="Title must be at least 3 characters long" />,
                };
            } else {
                return {
                    [FORM_ERROR]: <FormattedMessage id="product.validate.unknownValidationError" defaultMessage="Unknown validation error" />,
                };
            }
        }
    }),

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
                    initialValue: "New Product",
                    validate: (value: string) =>
                        value.length < 3 ? (
                            <FormattedMessage id="product.validate.titleMustBe3CharsLog" defaultMessage="Title must be at least 3 characters long" />
                        ) : undefined,
                },
                {
                    type: "text",
                    name: "slug",
                    validate: injectFormVariables(
                        ({ id, client, manufacturerCountry }: InjectedFormVariables & { manufacturerCountry: string }) =>
                            (value: string) => {
                                // eslint-disable-next-line no-console
                                console.log(manufacturerCountry);
                                return validateProductSlug({ value, id, client });
                            },
                    ),
                },
                { type: "date", name: "createdAt", label: "Created", readOnly: true },
                { type: "text", name: "description", label: "Description", multiline: true },
                {
                    type: "staticSelect",
                    name: "type",
                    label: "Type",
                    required: true,
                    inputType: "radio",
                    values: productTypeValues,
                    initialValue: "cap",
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
                    initialValue: { min: 10, max: 100 },
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
                { type: "boolean", name: "inStock", initialValue: true },
                { type: "date", name: "availableSince", startAdornment: { icon: "CalendarToday" }, initialValue: "2025-01-01" },
                { type: "component", component: FutureProductNotice },
                { type: "block", name: "image", label: "Image", block: DamImageBlock },
                { type: "fileUpload", name: "priceList", label: "Price List", maxFileSize: 1024 * 1024 * 4, download: true },
                { type: "fileUpload", name: "datasheets", label: "Datasheets", multiple: true, maxFileSize: 1024 * 1024 * 4, download: false },
                { type: "dateTime", name: "lastCheckedAt", label: "Last checked at", initialValue: new Date("2018-01-12T00:00:00Z") },
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
