import { buildSchema, introspectionFromSchema } from "graphql";
import { describe, expect, it } from "vitest";

import { findIntrospectionFieldType } from "../findIntrospectionFieldType";

describe("findIntrospectionFieldType", () => {
    it("field is found", () => {
        const schema = buildSchema(`
                type Query {
                    product(id: ID!): Product!
                }
    
                type Product {
                    id: ID!
                    name: String!
                }
            `);
        const introspection = introspectionFromSchema(schema);
        const introspectionFieldType = findIntrospectionFieldType({
            name: "name",
            gqlIntrospection: introspection,
            gqlType: "Product",
        });
        expect(introspectionFieldType).toBeDefined();
        expect(introspectionFieldType?.kind).toBe("SCALAR");
    });
    it("nullable field is found", () => {
        const schema = buildSchema(`
                type Query {
                    product(id: ID!): Product!
                }
    
                type Product {
                    id: ID!
                    name: String
                }
            `);
        const introspection = introspectionFromSchema(schema);
        const introspectionFieldType = findIntrospectionFieldType({
            name: "name",
            gqlIntrospection: introspection,
            gqlType: "Product",
        });
        expect(introspectionFieldType).toBeDefined();
        expect(introspectionFieldType?.kind).toBe("SCALAR");
    });
    it("nested field is found", () => {
        const schema = buildSchema(`
                type Query {
                    product(id: ID!): Product!
                }
    
                type Product {
                    id: ID!
                    foo: ProductFoo!
                }
                type ProductFoo {
                    name: String!
                }
            `);
        const introspection = introspectionFromSchema(schema);
        const introspectionFieldType = findIntrospectionFieldType({
            name: "foo.name",
            gqlIntrospection: introspection,
            gqlType: "Product",
        });
        expect(introspectionFieldType).toBeDefined();
        expect(introspectionFieldType?.kind).toBe("SCALAR");
    });
});
