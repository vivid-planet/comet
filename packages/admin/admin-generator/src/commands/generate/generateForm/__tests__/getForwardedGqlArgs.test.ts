import { buildSchema, introspectionFromSchema } from "graphql";
import { describe, expect, it } from "vitest";

import { findMutationTypeOrThrow } from "../../utils/findMutationType";
import { getForwardedGqlArgs } from "../getForwardedGqlArgs";

describe("getForwardedGqlArgs", () => {
    describe("nested non-nullable object", () => {
        const schema = buildSchema(`
            type Query {
                product(id: ID!): Product!
            } 

            type Product {
                id: ID!
                title: String!
                address: Address!
            }
            type Address {
                country: String!
            }

            type Mutation {
                createProduct(input: ProductInput!): Product!
                updateProduct(id: ID!, input: ProductInput!): Product!
            }

            input ProductInput {
                title: String
                address: AddressInput!
            }
            input AddressInput {
                country: String
            }
        `);
        const introspection = introspectionFromSchema(schema);

        it("should return required forwarded gql args when there are no fields", () => {
            const args = getForwardedGqlArgs({
                fields: [],
                gqlOperation: findMutationTypeOrThrow(`createProduct`, introspection),
                gqlIntrospection: introspection,
            });
            expect(args).toEqual([
                {
                    gqlArg: {
                        isInputArgSubfield: true,
                        name: "address",
                        type: "AddressInput",
                    },
                    imports: [
                        {
                            importPath: "@src/graphql.generated",
                            name: "GQLAddressInput",
                        },
                    ],
                    prop: {
                        name: "address",
                        optional: false,
                        type: "GQLAddressInput",
                    },
                },
            ]);
        });

        it("should have no forwarded gql args when there is a field for the required input", () => {
            const args = getForwardedGqlArgs({
                fields: [{ name: "address", type: "text" }],
                gqlOperation: findMutationTypeOrThrow(`createProduct`, introspection),
                gqlIntrospection: introspection,
            });
            expect(args).toEqual([]);
        });

        it("should have no forwarded gql args when there is a subfield for the required input", () => {
            const args = getForwardedGqlArgs({
                fields: [{ name: "address.city", type: "text" }],
                gqlOperation: findMutationTypeOrThrow(`createProduct`, introspection),
                gqlIntrospection: introspection,
            });
            expect(args).toEqual([]);
        });
    });
});
