import { buildSchema, introspectionFromSchema } from "graphql";
import { describe, expect, it } from "vitest";

import type { FormConfig, FormFieldConfig } from "../../generate-command.js";
import { generateFormField } from "../generateFormField.js";

const schema = buildSchema(`
            """
            A local date string (i.e., with no associated timezone) in \`YYYY-MM-DD\` format, e.g. \`2020-01-01\`.
            """
            scalar LocalDate

            type Query {
                products: [Product]!
            } 

            type Product {
                id: ID!
                availableSince: LocalDate
            }
          
            type Mutation {
                createProduct(input: ProductInput!): Product!
                updateProduct(id: ID!, input: ProductInput!): Product!
            }

            input ProductInput {
                title: String
                availableSince: LocalDate = null
            }
        `);

type GQLProduct = {
    __typename?: "Product";
    id: string;
    availableSince: string | null;
};

describe("generateFormField - datePicker", () => {
    it("should generate simple date field with LocalType scalar", async () => {
        const fieldConfig: FormFieldConfig<GQLProduct> = {
            type: "date",
            name: "availableSince",
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
        expect(formOutput.formValuesConfig).toMatchSnapshot();
    });
});
