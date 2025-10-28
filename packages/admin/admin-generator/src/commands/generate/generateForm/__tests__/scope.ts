import { buildSchema, introspectionFromSchema } from "graphql";

import { type FormConfig } from "../../generate-command";
import { generateForm } from "../generateForm";

describe("Form Scope", () => {
    const schema = buildSchema(`
        type Query {
            product(id: ID!): Product!
        }

        type Mutation {
            createProduct(scope: ProductScope!, input: ProductInput!): Product!
            updateProduct(id: ID!, input: ProductInput!): Product!
        }

        input ProductScope {
            domain: String!
        }

        input ProductInput {
            title: String
        }

        type Product {
            id: ID!
            title: String
        }
    `);
    type GQLProduct = {
        __typename?: "Product";
        id: string;
        title: string;
    };
    const introspection = introspectionFromSchema(schema);

    it("uses scope from context by default", async () => {
        const formConfig: FormConfig<GQLProduct> = {
            type: "form",
            gqlType: "Product",
            fields: [
                {
                    type: "text",
                    name: "title",
                },
            ],
        };

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
    it("generates prop for scope", async () => {
        const formConfig: FormConfig<GQLProduct> = {
            type: "form",
            gqlType: "Product",
            fields: [
                {
                    type: "text",
                    name: "title",
                },
            ],
            scopeAsProp: true,
        };

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
