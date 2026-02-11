import { buildSchema, introspectionFromSchema } from "graphql";
import { describe, expect, it } from "vitest";

import { generateErrorMessagesCode } from "../generateErrorMessages";

describe("generateErrorMessagesCode", () => {
    it("returns empty string when enum is not found", () => {
        const schema = buildSchema(`
            type Query {
                product: Product!
            }

            type Product {
                id: ID!
            }
        `);

        const introspection = introspectionFromSchema(schema);

        expect(
            generateErrorMessagesCode({
                enumName: "ProductError",
                gqlType: "Product",
                variableName: "submissionErrorMessages",
                gqlIntrospection: introspection,
            }),
        ).toBe("");
    });

    it("adds GQL prefix to type and uses description for defaultMessage", () => {
        const schema = buildSchema(`
            type Query {
                product: Product!
            }

            type Product {
                id: ID!
            }

            enum ProductError {
                "Title is required"
                titleRequired
                titleTooLong @deprecated(reason: "")
            }
        `);

        const introspection = introspectionFromSchema(schema);

        const generated = generateErrorMessagesCode({
            enumName: "ProductError",
            gqlType: "Product",
            variableName: "submissionErrorMessages",
            gqlIntrospection: introspection,
        });

        expect(generated).toBe(`const submissionErrorMessages: { [K in GQLProductError]: ReactNode } = {
titleRequired: <FormattedMessage id="product.form.error.titleRequired" defaultMessage="Title is required" />,
titleTooLong: <FormattedMessage id="product.form.error.titleTooLong" defaultMessage="Title Too Long" />,
};`);
    });
});
