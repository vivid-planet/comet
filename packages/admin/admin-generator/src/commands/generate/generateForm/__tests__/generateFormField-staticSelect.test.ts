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
    it("should generate staticSelect with nested field", async () => {
        const nestedSchema = buildSchema(`
            type Query {
                productHighlights: [ProductHighlight!]
            }

            type ProductHighlight {
                id: ID!
                product: Product!
            }

            type Product {
                id: ID!
                type: ProductType!
            }

            type Mutation {
                createProductHighlight(input: ProductHighlightInput!): ProductHighlight!
                updateProductHighlight(id: ID!, input: ProductHighlightInput!): ProductHighlight!
            }

            input ProductHighlightInput {
                productId: ID
                productType: ProductType
            }

            enum ProductType {
              cap
              shirt
              tie
            }
        `);

        type GQLProductHighlight = {
            __typename?: "ProductHighlight";
            id: string;
            product: GQLProduct;
        };

        const fieldConfig: FormFieldConfig<GQLProductHighlight> = {
            type: "staticSelect",
            name: "product.type",
        };

        const formConfig: FormConfig<GQLProductHighlight> = {
            type: "form",
            gqlType: "ProductHighlight",
            fields: [fieldConfig],
        };

        const introspection = introspectionFromSchema(nestedSchema);

        const formOutput = generateFormField({
            gqlIntrospection: introspection,
            baseOutputFilename: "ProductHighlightForm",
            formFragmentName: "ProductHighlightFormFragment",
            config: fieldConfig,
            formConfig,
            gqlType: "ProductHighlight",
        });
        expect(formOutput.code).toMatchSnapshot();
    });
});
