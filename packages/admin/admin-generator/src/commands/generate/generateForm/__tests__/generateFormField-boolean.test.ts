import { buildSchema, introspectionFromSchema } from "graphql";
import { describe, expect, it } from "vitest";

import type { FormattedMessageElement, FormConfig, FormFieldConfig } from "../../generate-command";
import { generateFormField } from "../generateFormField";

const schema = buildSchema(`
            type Query {
                products: [Product]!
            } 

            type Product {
                id: ID!
                hasParticipated: Boolean
            }
          
            type Mutation {
                createProduct(input: ProductInput!): Product!
                updateProduct(id: ID!, input: ProductInput!): Product!
            }

            input ProductInput {
                title: String
                hasParticipated: Boolean
            }
        `);

type GQLProduct = {
    __typename?: "Product";
    id: string;
    hasParticipated: boolean | null;
};

describe("generateFormField - boolean", () => {
    it("should generate simple boolean field with label as fieldLabel", async () => {
        const fieldConfig: FormFieldConfig<GQLProduct> = {
            type: "boolean",
            name: "hasParticipated",
        };

        const formConfig: FormConfig<GQLProduct> = {
            type: "form",
            gqlType: "Product",
            fields: [fieldConfig],
        };

        const introspection = introspectionFromSchema(schema);

        const formOutput = generateFormField({
            gqlIntrospection: introspection,
            baseOutputFilename: "ProductForm",
            formFragmentName: "ProductFormFragment",
            config: fieldConfig,
            formConfig,
            gqlType: "Product",
        });

        expect(formOutput.code).toContain("<CheckboxField");
        expect(formOutput.code).toContain('fieldLabel={<FormattedMessage id="product.hasParticipated" defaultMessage="Has Participated" />}');
        expect(formOutput.code).toContain('name="hasParticipated"');
        expect(formOutput.code).not.toContain("label={");
    });

    it("should generate boolean field with both fieldLabel and checkboxLabel", async () => {
        const fieldConfig: FormFieldConfig<GQLProduct> = {
            type: "boolean",
            name: "hasParticipated",
            checkboxLabel: "Yes/No",
        };

        const formConfig: FormConfig<GQLProduct> = {
            type: "form",
            gqlType: "Product",
            fields: [fieldConfig],
        };

        const introspection = introspectionFromSchema(schema);

        const formOutput = generateFormField({
            gqlIntrospection: introspection,
            baseOutputFilename: "ProductForm",
            formFragmentName: "ProductFormFragment",
            config: fieldConfig,
            formConfig,
            gqlType: "Product",
        });

        expect(formOutput.code).toContain("<CheckboxField");
        expect(formOutput.code).toContain('fieldLabel={<FormattedMessage id="product.hasParticipated" defaultMessage="Has Participated" />}');
        expect(formOutput.code).toContain('label={<FormattedMessage id="product.hasParticipated.checkboxLabel" defaultMessage="Yes/No" />}');
        expect(formOutput.code).toContain('name="hasParticipated"');
    });

    it("should generate boolean field with FormattedMessageElement as checkboxLabel", async () => {
        const fieldConfig: FormFieldConfig<GQLProduct> = {
            type: "boolean",
            name: "hasParticipated",
            checkboxLabel: {
                formattedMessageId: "custom.checkboxLabel.id",
                defaultMessage: "Custom Checkbox Label",
            } as unknown as FormattedMessageElement,
        };

        const formConfig: FormConfig<GQLProduct> = {
            type: "form",
            gqlType: "Product",
            fields: [fieldConfig],
        };

        const introspection = introspectionFromSchema(schema);

        const formOutput = generateFormField({
            gqlIntrospection: introspection,
            baseOutputFilename: "ProductForm",
            formFragmentName: "ProductFormFragment",
            config: fieldConfig,
            formConfig,
            gqlType: "Product",
        });

        expect(formOutput.code).toContain("<CheckboxField");
        expect(formOutput.code).toContain('fieldLabel={<FormattedMessage id="product.hasParticipated" defaultMessage="Has Participated" />}');
        expect(formOutput.code).toContain('label={<FormattedMessage id="custom.checkboxLabel.id" defaultMessage="Custom Checkbox Label" />}');
        expect(formOutput.code).toContain('name="hasParticipated"');
    });
});
