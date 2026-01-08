import { buildSchema, introspectionFromSchema } from "graphql";
import { describe, expect, it } from "vitest";

import { type GridConfig } from "../../generate-command.js";
import { generateGrid } from "../generateGrid.js";

describe("Grid Scope", () => {
    const schema = buildSchema(`
        type Query {
            products(scope: ProductScope!): [Product!]!
        }

        type Mutation {
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
        const gridConfig: GridConfig<GQLProduct> = {
            type: "grid",
            gqlType: "Product",
            columns: [
                {
                    type: "text",
                    name: "title",
                },
            ],
        };

        const formOutput = generateGrid(
            {
                gqlIntrospection: introspection,
                baseOutputFilename: "ProductsGrid",
                exportName: "ProductsGrid",
                targetDirectory: "/test",
            },
            gridConfig,
        );
        expect(formOutput.code).toMatchSnapshot();
    });
    it("generates prop for scope", async () => {
        const gridConfig: GridConfig<GQLProduct> = {
            type: "grid",
            gqlType: "Product",
            columns: [
                {
                    type: "text",
                    name: "title",
                },
            ],
            scopeAsProp: true,
        };

        const formOutput = generateGrid(
            {
                gqlIntrospection: introspection,
                baseOutputFilename: "ProductsGrid",
                exportName: "ProductsGrid",
                targetDirectory: "/test",
            },
            gridConfig,
        );
        expect(formOutput.code).toMatchSnapshot();
    });

    it("generates correct gql import for scope", async () => {
        const gridConfig: GridConfig<GQLProduct> = {
            type: "grid",
            gqlType: "Product",
            columns: [
                {
                    type: "text",
                    name: "title",
                },
            ],
            scopeAsProp: true,
        };

        const formOutput = generateGrid(
            {
                gqlIntrospection: introspection,
                baseOutputFilename: "ProductsGrid",
                exportName: "ProductsGrid",
                targetDirectory: "/test",
            },
            gridConfig,
        );

        const match = formOutput.code.match(/import {(.*?)} from "@src\/graphql.generated";/);
        if (!match) throw new Error("GQL import not found");
        const imports = match[1].split(",").map((imp) => imp.trim());
        expect(imports).not.toContain("ProductScope");
        expect(imports).toContain("GQLProductScope");
    });
});
