import { buildSchema, type GraphQLSchema, introspectionFromSchema, type IntrospectionQuery } from "graphql";
import { beforeAll, describe, expect, it } from "vitest";

import { findIntrospectionObjectType } from "../generateAsyncSelect";

describe("generateAsyncSelect", () => {
    describe("findIntrospectionObjectType single", () => {
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
        it("should find object for a standard select", () => {
            const { objectType, multiple } = findIntrospectionObjectType({
                config: { type: "asyncSelect", name: "product", rootQuery: "products" },
                gqlType: "ProductHighlight",
                gqlIntrospection: introspection,
            });
            expect(multiple).toBe(false);
            expect(objectType).toBeDefined();
            expect(objectType.name).toBe("Product");
        });
        it("should find object for a filter select", () => {
            const { objectType, multiple } = findIntrospectionObjectType({
                config: {
                    type: "asyncSelectFilter",
                    name: "productCategory",
                    loadValueQueryField: "product.category",
                    rootQuery: "productCategories",
                },
                gqlType: "ProductHighlight",
                gqlIntrospection: introspection,
            });
            expect(multiple).toBe(false);
            expect(objectType).toBeDefined();
            expect(objectType.name).toBe("ProductCategory");
        });
    });
    describe("findIntrospectionObjectType nested field", () => {
        let schema: GraphQLSchema;
        let introspection: IntrospectionQuery;

        beforeAll(() => {
            schema = buildSchema(`
            type Query {
                categories: [ProductCategory!]
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
        it("should find object for a standard select with nested field", () => {
            const { objectType, multiple } = findIntrospectionObjectType({
                config: { type: "asyncSelect", name: "product.category", rootQuery: "categories" },
                gqlType: "ProductHighlight",
                gqlIntrospection: introspection,
            });
            expect(multiple).toBe(false);
            expect(objectType).toBeDefined();
            expect(objectType.name).toBe("ProductCategory");
        });
    });
    describe("findIntrospectionObjectType list", () => {
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
                products: [Product!]!
            }
        `);

            introspection = introspectionFromSchema(schema);
        });
        it("should find object for a standard select", () => {
            const { objectType, multiple } = findIntrospectionObjectType({
                config: { type: "asyncSelect", name: "products", rootQuery: "products" },
                gqlType: "ProductHighlight",
                gqlIntrospection: introspection,
            });
            expect(multiple).toBe(true);
            expect(objectType).toBeDefined();
            expect(objectType.name).toBe("Product");
        });
        it("should fail for a filter select", () => {
            expect(() => {
                findIntrospectionObjectType({
                    config: {
                        type: "asyncSelectFilter",
                        name: "productCategory",
                        loadValueQueryField: "product.category",
                        rootQuery: "productCategories",
                    },
                    gqlType: "ProductHighlight",
                    gqlIntrospection: introspection,
                });
            }).toThrow();
        });
    });
});
