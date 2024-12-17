import { buildSchema, introspectionFromSchema } from "graphql";

import { generateGrid } from "../../generateGrid";
import { GridConfig } from "../../generator";

describe("Admin Generator", () => {
    describe("Grid", () => {
        it("should generate correct query params prefix", async () => {
            const schema = buildSchema(`
                type Query {
                    product(id: ID!): Product!
                    products: [Product!]!
                }

                type Mutation {
                    createProduct(title: String!): Product!
                }

                type Product {
                    id: ID!
                    title: String!
                }
            `);

            const gqlIntrospection = introspectionFromSchema(schema);
            const config: GridConfig<{ __typename: "Product" }> = {
                type: "grid",
                gqlType: "Product",
                columns: [],
                queryParamsPrefix: "testPrefix",
            };

            const generated = generateGrid(
                { exportName: "ProductGrid", gqlIntrospection, baseOutputFilename: "ProductGrid", targetDirectory: "src" },
                config,
            );

            expect(generated.code).toContain('queryParamsPrefix: "testPrefix"');
        });
    });
});
