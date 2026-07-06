import { buildSchema, introspectionFromSchema } from "graphql";
import { describe, expect, it } from "vitest";

import type { FormConfig, FormFieldConfig } from "../../generate-command";
import { generateForm } from "../generateForm";

const schema = buildSchema(`
    type Query {
        products: [Product!]!
    } 

    type Product {
        id: ID!
        title: String!
    }
    
    type Mutation {
        createProduct(input: ProductInput!): Product!
        updateProduct(id: ID!, input: ProductInput!): Product!
    }

    input ProductInput {
        title: String!
    }
`);

type GQLProduct = {
    __typename?: "Product";
    id: string;
    title: string;
};

describe("initialValueAsProp", () => {
    it("should generate simple form with initialValues prop", async () => {
        const fieldConfig: FormFieldConfig<GQLProduct> = {
            type: "text",
            name: "title",
        };

        const formConfig: FormConfig<GQLProduct> = {
            type: "form",
            gqlType: "Product",
            fields: [fieldConfig],
            initialValuesAsProp: true,
        };

        const introspection = introspectionFromSchema(schema);

        const formOutput = generateForm(
            {
                gqlIntrospection: introspection,
                baseOutputFilename: "ProductForm",
                exportName: "ProductForm",
                targetDirectory: "/test",
            },
            formConfig,
        );
        expect(formOutput.code).toMatchSnapshot();
    });
});
