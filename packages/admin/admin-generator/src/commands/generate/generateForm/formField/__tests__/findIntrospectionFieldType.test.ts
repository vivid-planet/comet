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
    it("nested field through 1:1 relation is found", () => {
        const schema = buildSchema(`
                type Query {
                    product(id: ID!): Product!
                }

                type Product {
                    id: ID!
                    details: ProductDetails!
                }
                type ProductDetails {
                    availabilityStatus: ProductAvailabilityStatus!
                }
                enum ProductAvailabilityStatus {
                    inStock
                    outOfStock
                }
            `);
        const introspection = introspectionFromSchema(schema);
        const introspectionFieldType = findIntrospectionFieldType({
            name: "details.availabilityStatus",
            gqlIntrospection: introspection,
            gqlType: "Product",
        });
        expect(introspectionFieldType).toBeDefined();
        expect(introspectionFieldType?.kind).toBe("ENUM");
        if (introspectionFieldType?.kind === "ENUM") {
            expect(introspectionFieldType.name).toBe("ProductAvailabilityStatus");
        }
    });
    it("nested field through 2-level relation is found", () => {
        const schema = buildSchema(`
                type Query {
                    product(id: ID!): Product!
                }

                type Product {
                    id: ID!
                    details: ProductDetails!
                }
                type ProductDetails {
                    audit: ProductAudit!
                }
                type ProductAudit {
                    status: ProductAuditStatus!
                }
                enum ProductAuditStatus {
                    pending
                    approved
                }
            `);
        const introspection = introspectionFromSchema(schema);
        const introspectionFieldType = findIntrospectionFieldType({
            name: "details.audit.status",
            gqlIntrospection: introspection,
            gqlType: "Product",
        });
        expect(introspectionFieldType).toBeDefined();
        expect(introspectionFieldType?.kind).toBe("ENUM");
        if (introspectionFieldType?.kind === "ENUM") {
            expect(introspectionFieldType.name).toBe("ProductAuditStatus");
        }
    });
});
