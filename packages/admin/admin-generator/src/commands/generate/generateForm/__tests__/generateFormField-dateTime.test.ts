import { buildSchema, introspectionFromSchema } from "graphql";

import type { FormConfig, FormFieldConfig } from "../../generate-command";
import { generateFormField } from "../generateFormField";

const schema = buildSchema(`
            """
            A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format.
            """
            scalar DateTime

            type Query {
                products: [Product]!
            } 

            type Product {
                id: ID!
                lastCheckedAt: DateTime
            }
          
            type Mutation {
                createProduct(input: ProductInput!): Product!
                updateProduct(id: ID!, input: ProductInput!): Product!
            }

            input ProductInput {
                title: String
                lastCheckedAt: DateTime
            }
        `);

type GQLProduct = {
    __typename?: "Product";
    id: string;
    lastCheckedAt: string | null;
};

describe("generateFormField - dateTime", () => {
    it("should generate simple dateTime field  with DateTime scalar", async () => {
        const fieldConfig: FormFieldConfig<GQLProduct> = {
            type: "dateTime",
            name: "lastCheckedAt",
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
