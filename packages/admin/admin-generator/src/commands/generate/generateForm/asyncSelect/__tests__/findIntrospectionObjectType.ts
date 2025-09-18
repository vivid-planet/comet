import { buildSchema, type GraphQLSchema, introspectionFromSchema, type IntrospectionQuery } from "graphql";

import { findIntrospectionObjectType } from "../generateAsyncSelect";

describe("generateAsyncSelect", () => {
    let schema: GraphQLSchema;
    let introspection: IntrospectionQuery;

    beforeAll(() => {
        schema = buildSchema(`
            type Query {
                products: [Product!]
            } 

            type Product {
                id: ID!
                title: String!
                category: ProductCategory
            }
            type ProductCategory {
                id: ID!
                title: String!
            }
            type ProductHighlight {
                id: ID!
                product: Product!
            }
        `);

        introspection = introspectionFromSchema(schema);
    });
    describe("findIntrospectionObjectType", () => {
        it("should find object for a standard select", () => {
            const objectType = findIntrospectionObjectType({
                config: { type: "asyncSelect", name: "product", rootQuery: "products" },
                gqlType: "ProductHighlight",
                gqlIntrospection: introspection,
            });
            expect(objectType).toBeDefined();
            expect(objectType.name).toBe("Product");
        });
        it("should find object for a standard select", () => {
            const objectType = findIntrospectionObjectType({
                config: {
                    type: "asyncSelectFilter",
                    name: "productCategory",
                    loadValueQueryField: "product.category",
                    rootQuery: "productCategories",
                },
                gqlType: "ProductHighlight",
                gqlIntrospection: introspection,
            });
            expect(objectType).toBeDefined();
            expect(objectType.name).toBe("ProductCategory");
        });
    });
});
