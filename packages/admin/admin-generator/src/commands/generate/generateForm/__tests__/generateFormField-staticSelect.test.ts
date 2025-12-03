import { buildSchema, introspectionFromSchema } from "graphql";

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
});
