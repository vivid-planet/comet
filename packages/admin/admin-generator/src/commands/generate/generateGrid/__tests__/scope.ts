import { buildSchema, introspectionFromSchema } from "graphql";

import { type GridConfig } from "../../generate-command";
import { parseSource } from "../../utils/test-helper";
import { generateGrid } from "../generateGrid";

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

        const source = parseSource(formOutput.code);
        const importDeclarations = source.getImportDeclarations();

        const graphqlImportDeclaration = importDeclarations.find(
            (getImportDeclaration) => getImportDeclaration.getModuleSpecifierValue() === "@src/graphql.generated",
        );
        expect(graphqlImportDeclaration).toBeDefined();

        const gqlScopeImport = graphqlImportDeclaration?.getNamedImports().find((namedImport) => namedImport.getName() === "GQLProductScope");
        expect(gqlScopeImport).toBeDefined();
    });
});
