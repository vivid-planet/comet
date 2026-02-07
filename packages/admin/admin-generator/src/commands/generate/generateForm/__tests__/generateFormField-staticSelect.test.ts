import { buildSchema, introspectionFromSchema } from "graphql";
import { describe, expect, it } from "vitest";

import type { FormConfig, FormFieldConfig } from "../../generate-command";
import { generateFormField } from "../generateFormField";

const schema = buildSchema(`
            type Query {
                products: [Product]!
            } 

            type Product {
                id: ID!
                type: ProductType!
            }
          
            type Mutation {
                createProduct(input: ProductInput!): Product!
                updateProduct(id: ID!, input: ProductInput!): Product!
            }

            input ProductInput {
                title: String
                type: ProductType
            }
            
            enum ProductType {
              cap
              shirt
              tie
            }
        `);

type GQLProduct = {
    __typename?: "Product";
    id: string;
    type: GQLProductType;
};

type GQLProductType = "cap" | "shirt" | "tie";

describe("generateFormField - staticSelect", () => {
    it("should generate simple staticSelect", async () => {
        const fieldConfig: FormFieldConfig<GQLProduct> = {
            type: "staticSelect",
            name: "type",
        };

        const formConfig: FormConfig<GQLProduct> = {
            type: "form",
            gqlType: "Product",
            fields: [fieldConfig],
        };

        const introspection = introspectionFromSchema(schema);

        const formOutput = generateFormField({
            gqlIntrospection: introspection,
            baseOutputFilename: "ProductForm",
            formFragmentName: "ProductFormFragment",
            config: fieldConfig,
            formConfig,
            gqlType: "Product",
        });
        expect(formOutput.code).toMatchSnapshot();
    });
    it("should generate readonly staticSelect", async () => {
        const fieldConfig: FormFieldConfig<GQLProduct> = {
            type: "staticSelect",
            name: "type",
            readOnly: true,
        };

        const formConfig: FormConfig<GQLProduct> = {
            type: "form",
            gqlType: "Product",
            fields: [fieldConfig],
        };

        const introspection = introspectionFromSchema(schema);

        const formOutput = generateFormField({
            gqlIntrospection: introspection,
            baseOutputFilename: "ProductForm",
            formFragmentName: "ProductFormFragment",
            config: fieldConfig,
            formConfig,
            gqlType: "Product",
        });
        expect(formOutput.code).toMatchSnapshot();
    });

    it("should generate staticSelect for nested fields on 1:1 relations", async () => {
        const relationSchema = buildSchema(`
            type Query {
                products: [Product!]!
            }

            type Product {
                id: ID!
                details: ProductDetails!
            }

            type ProductDetails {
                visibilityStatus: ProductVisibilityStatus!
            }

            type Mutation {
                updateProduct(id: ID!, input: ProductInput!): Product!
            }

            input ProductInput {
                details: ProductDetailsInput!
            }

            input ProductDetailsInput {
                visibilityStatus: ProductVisibilityStatus!
            }

            enum ProductVisibilityStatus {
                visible
                hidden
            }
        `);

        type GQLProduct = {
            __typename?: "Product";
            id: string;
            details: {
                __typename?: "ProductDetails";
                visibilityStatus: "visible" | "hidden";
            };
        };

        const fieldConfig = {
            type: "staticSelect",
            name: "details.visibilityStatus",
            inputType: "select",
        } as FormFieldConfig<GQLProduct>;

        const formConfig: FormConfig<GQLProduct> = {
            type: "form",
            gqlType: "Product",
            fields: [fieldConfig],
        };

        const introspection = introspectionFromSchema(relationSchema);

        const formOutput = generateFormField({
            gqlIntrospection: introspection,
            baseOutputFilename: "ProductForm",
            formFragmentName: "ProductFormFragment",
            config: fieldConfig,
            formConfig,
            gqlType: "Product",
        });

        expect(formOutput.code).toMatchSnapshot();
    });
});
