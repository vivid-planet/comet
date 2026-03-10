import { buildSchema, introspectionFromSchema } from "graphql";
import { describe, expect, it } from "vitest";

import { type FormConfig, type FormFieldConfig } from "../../generate-command";
import { generateForm } from "../generateForm";
import { generateFormField } from "../generateFormField";

describe("AsyncSelect filter", () => {
    it("generates field without filter", async () => {
        const schema = buildSchema(`
            type Query {
                products: [Product]!
                categories: [Category]!
            } 

            type Product {
                id: ID!
                title: String!
                category: Category!
            }
            type Category {
                id: ID!
                name: String!
            }

            type Mutation {
                createProduct(input: ProductInput!): Product!
                updateProduct(id: ID!, input: ProductInput!): Product!
            }

            input ProductInput {
                title: String
                category: ID
            }
        `);
        type GQLCategory = {
            __typename?: "Category";
            id: string;
            name: string;
        };
        type GQLProduct = {
            __typename?: "Product";
            id: string;
            title: string;
            category: GQLCategory;
        };

        const introspection = introspectionFromSchema(schema);

        const fieldConfig: FormFieldConfig<GQLProduct> = {
            type: "asyncSelect",
            rootQuery: "categories",
            name: "category",
        };
        const formConfig: FormConfig<GQLProduct> = {
            type: "form",
            gqlType: "Product",
            fields: [fieldConfig],
        };

        const output = generateFormField({
            gqlIntrospection: introspection,
            baseOutputFilename: "ProductForm",
            formFragmentName: "ProductFormFragment",
            config: fieldConfig,
            formConfig,
            gqlType: "Product",
        });

        expect(output.code).toMatchSnapshot();
    });

    it("generates filter with value dependent on other field", async () => {
        const schema = buildSchema(`
            type Query {
                products: [Product]!
                categories(title: String): [Category]!
            } 

            type Product {
                id: ID!
                title: String!
                category: Category!
            }
            type Category {
                id: ID!
                name: String!
            }

            type Mutation {
                createProduct(input: ProductInput!): Product!
                updateProduct(id: ID!, input: ProductInput!): Product!
            }

            input ProductInput {
                title: String
                category: ID
            }
        `);
        type GQLCategory = {
            __typename?: "Category";
            id: string;
            name: string;
        };
        type GQLProduct = {
            __typename?: "Product";
            id: string;
            title: string;
            category: GQLCategory;
        };

        const introspection = introspectionFromSchema(schema);

        const fieldConfig: FormFieldConfig<GQLProduct> = {
            type: "asyncSelect",
            rootQuery: "categories",
            name: "category",
            filter: {
                type: "field",
                formFieldName: "title",
            },
        };
        const formConfig: FormConfig<GQLProduct> = {
            type: "form",
            gqlType: "Product",
            fields: [
                {
                    type: "text",
                    name: "title",
                    required: true,
                },
                fieldConfig,
            ],
        };

        const output = generateFormField({
            gqlIntrospection: introspection,
            baseOutputFilename: "ProductForm",
            formFragmentName: "ProductFormFragment",
            config: fieldConfig,
            formConfig,
            gqlType: "Product",
        });

        expect(output.code).toMatchSnapshot();
    });

    it("generates formProp with string filter as root query arg", async () => {
        const schema = buildSchema(`
            type Query {
                products: [Product]!
                categories(foo: String): [Category]!
            }

            type Product {
                id: ID!
                title: String!
                category: Category!
            }
            type Category {
                id: ID!
                name: String!
            }

            type Mutation {
                createProduct(input: ProductInput!): Product!
                updateProduct(id: ID!, input: ProductInput!): Product!
            }

            input ProductInput {
                title: String
                category: ID
            }
        `);
        type GQLCategory = {
            __typename?: "Category";
            id: string;
            name: string;
        };
        type GQLProduct = {
            __typename?: "Product";
            id: string;
            title: string;
            category: GQLCategory;
        };

        const introspection = introspectionFromSchema(schema);

        const fieldConfig: FormFieldConfig<GQLProduct> = {
            type: "asyncSelect",
            rootQuery: "categories",
            name: "category",
            filter: {
                type: "formProp",
                propName: "foo",
            },
        };
        const formConfig: FormConfig<GQLProduct> = {
            type: "form",
            gqlType: "Product",
            fields: [fieldConfig],
        };

        const fieldOutput = generateFormField({
            gqlIntrospection: introspection,
            baseOutputFilename: "ProductForm",
            formFragmentName: "ProductFormFragment",
            config: fieldConfig,
            formConfig,
            gqlType: "Product",
        });
        expect(fieldOutput.formProps).toEqual([
            {
                name: "foo",
                type: "string",
                optional: false,
            },
        ]);

        const formOutput = generateForm(
            {
                gqlIntrospection: introspection,
                baseOutputFilename: "ProductForm",
                exportName: "ProductForm",
                targetDirectory: "/test",
            },
            formConfig,
        );
        expect(formOutput.code).toMatchSnapshot();
    });

    it("generates formProp with enum filter as root query arg", async () => {
        const schema = buildSchema(`
            enum CategoryType {
                shirt
                shoes
            }
            type Query {
                products: [Product]!
                categories(type: CategoryType): [Category]!
            }

            type Product {
                id: ID!
                title: String!
                category: Category!
            }
            type Category {
                id: ID!
                name: String!
            }

            type Mutation {
                createProduct(input: ProductInput!): Product!
                updateProduct(id: ID!, input: ProductInput!): Product!
            }

            input ProductInput {
                title: String
                category: ID
            }
        `);
        type GQLCategory = {
            __typename?: "Category";
            id: string;
            name: string;
        };
        type GQLProduct = {
            __typename?: "Product";
            id: string;
            title: string;
            category: GQLCategory;
        };

        const introspection = introspectionFromSchema(schema);

        const fieldConfig: FormFieldConfig<GQLProduct> = {
            type: "asyncSelect",
            rootQuery: "categories",
            name: "category",
            filter: {
                type: "formProp",
                propName: "type",
            },
        };
        const formConfig: FormConfig<GQLProduct> = {
            type: "form",
            gqlType: "Product",
            fields: [fieldConfig],
        };

        const fieldOutput = generateFormField({
            gqlIntrospection: introspection,
            baseOutputFilename: "ProductForm",
            formFragmentName: "ProductFormFragment",
            config: fieldConfig,
            formConfig,
            gqlType: "Product",
        });
        expect(fieldOutput.formProps).toEqual([
            {
                name: "type",
                type: "GQLCategoryType",
                optional: false,
            },
        ]);

        const formOutput = generateForm(
            {
                gqlIntrospection: introspection,
                baseOutputFilename: "ProductForm",
                exportName: "ProductForm",
                targetDirectory: "/test",
            },
            formConfig,
        );
        expect(formOutput.code).toMatchSnapshot();
    });

    describe("with formProp filter with filter arg", () => {
        const schema = buildSchema(`
            type Query {
                products: [Product]!
                categories(filter: CategoryFilter): [Category]!
            }

            input CategoryFilter {
                foo: StringFilter
                type: CategoryTypeEnumFilter
                and: [CategoryFilter!]
                or: [CategoryFilter!]
            }

            input CategoryTypeEnumFilter {
                isAnyOf: [CategoryType!]
                equal: CategoryType
                notEqual: CategoryType
            }

            input StringFilter {
                contains: String
                notContains: String
                startsWith: String
                endsWith: String
                equal: String
                notEqual: String
                isAnyOf: [String!]
                isEmpty: Boolean
                isNotEmpty: Boolean
            }

            type Product {
                id: ID!
                title: String!
                category: Category!
            }
            type Category {
                id: ID!
                name: String!
            }

            enum CategoryType {
                shirt
                shoes
            }

            type Mutation {
                createProduct(input: ProductInput!): Product!
                updateProduct(id: ID!, input: ProductInput!): Product!
            }

            input ProductInput {
                title: String
                category: ID
            }
        `);
        type GQLCategory = {
            __typename?: "Category";
            id: string;
            name: string;
        };
        type GQLProduct = {
            __typename?: "Product";
            id: string;
            title: string;
            category: GQLCategory;
        };

        const introspection = introspectionFromSchema(schema);

        it("generates a string filter", async () => {
            const fieldConfig: FormFieldConfig<GQLProduct> = {
                type: "asyncSelect",
                rootQuery: "categories",
                name: "category",
                filter: {
                    type: "formProp",
                    propName: "foo",
                },
            };
            const formConfig: FormConfig<GQLProduct> = {
                type: "form",
                gqlType: "Product",
                fields: [fieldConfig],
            };

            const fieldOutput = generateFormField({
                gqlIntrospection: introspection,
                baseOutputFilename: "ProductForm",
                formFragmentName: "ProductFormFragment",
                config: fieldConfig,
                formConfig,
                gqlType: "Product",
            });
            expect(fieldOutput.formProps).toEqual([
                {
                    name: "foo",
                    type: "string",
                    optional: false,
                },
            ]);

            const formOutput = generateForm(
                {
                    gqlIntrospection: introspection,
                    baseOutputFilename: "ProductForm",
                    exportName: "ProductForm",
                    targetDirectory: "/test",
                },
                formConfig,
            );
            expect(formOutput.code).toMatchSnapshot();
        });

        it("generates an enum filter", async () => {
            const fieldConfig: FormFieldConfig<GQLProduct> = {
                type: "asyncSelect",
                rootQuery: "categories",
                name: "category",
                filter: {
                    type: "formProp",
                    propName: "categoryType",
                    rootQueryArg: "type",
                },
            };
            const formConfig: FormConfig<GQLProduct> = {
                type: "form",
                gqlType: "Product",
                fields: [fieldConfig],
            };

            const fieldOutput = generateFormField({
                gqlIntrospection: introspection,
                baseOutputFilename: "ProductForm",
                formFragmentName: "ProductFormFragment",
                config: fieldConfig,
                formConfig,
                gqlType: "Product",
            });
            expect(fieldOutput.formProps).toEqual([
                {
                    name: "categoryType",
                    type: "GQLCategoryType",
                    optional: false,
                },
            ]);

            const formOutput = generateForm(
                {
                    gqlIntrospection: introspection,
                    baseOutputFilename: "ProductForm",
                    exportName: "ProductForm",
                    targetDirectory: "/test",
                },
                formConfig,
            );
            expect(formOutput.code).toMatchSnapshot();
        });
    });

    it("uses field name for query name by default (multiple fields with same rootQuery)", async () => {
        const schema = buildSchema(`
            type Query {
                people(search: String): PeopleConnection!
            }

            type PeopleConnection {
                nodes: [Person!]!
            }

            type Visit {
                id: ID!
                host: Person!
                guest: Person!
            }
            type Person {
                id: ID!
                name: String!
            }

            type Mutation {
                createVisit(input: VisitInput!): Visit!
                updateVisit(id: ID!, input: VisitInput!): Visit!
            }

            input VisitInput {
                host: ID
                guest: ID
            }
        `);
        type GQLPerson = {
            __typename?: "Person";
            id: string;
            name: string;
        };
        type GQLVisit = {
            __typename?: "Visit";
            id: string;
            host: GQLPerson;
            guest: GQLPerson;
        };

        const introspection = introspectionFromSchema(schema);

        const hostFieldConfig: FormFieldConfig<GQLVisit> = {
            type: "asyncSelect",
            rootQuery: "people",
            name: "host",
        };
        const guestFieldConfig: FormFieldConfig<GQLVisit> = {
            type: "asyncSelect",
            rootQuery: "people",
            name: "guest",
        };
        const formConfig: FormConfig<GQLVisit> = {
            type: "form",
            gqlType: "Visit",
            fields: [hostFieldConfig, guestFieldConfig],
        };

        const hostOutput = generateFormField({
            gqlIntrospection: introspection,
            baseOutputFilename: "VisitForm",
            formFragmentName: "VisitFormFragment",
            config: hostFieldConfig,
            formConfig,
            gqlType: "Visit",
        });
        const guestOutput = generateFormField({
            gqlIntrospection: introspection,
            baseOutputFilename: "VisitForm",
            formFragmentName: "VisitFormFragment",
            config: guestFieldConfig,
            formConfig,
            gqlType: "Visit",
        });

        // Each field gets a unique query name derived from the field name, not rootQuery
        expect(hostOutput.code).toContain("HostSelect");
        expect(hostOutput.code).not.toContain("PeopleSelect");
        expect(guestOutput.code).toContain("GuestSelect");
        expect(guestOutput.code).not.toContain("PeopleSelect");
    });

    it("uses custom queryName when provided", async () => {
        const schema = buildSchema(`
            type Query {
                people(search: String): PeopleConnection!
            }

            type PeopleConnection {
                nodes: [Person!]!
            }

            type Visit {
                id: ID!
                host: Person!
                guest: Person!
            }
            type Person {
                id: ID!
                name: String!
            }

            type Mutation {
                createVisit(input: VisitInput!): Visit!
                updateVisit(id: ID!, input: VisitInput!): Visit!
            }

            input VisitInput {
                host: ID
                guest: ID
            }
        `);
        type GQLPerson = {
            __typename?: "Person";
            id: string;
            name: string;
        };
        type GQLVisit = {
            __typename?: "Visit";
            id: string;
            host: GQLPerson;
            guest: GQLPerson;
        };

        const introspection = introspectionFromSchema(schema);

        const hostFieldConfig: FormFieldConfig<GQLVisit> = {
            type: "asyncSelect",
            rootQuery: "people",
            queryName: "VisitHostSelect",
            name: "host",
        };

        const formConfig: FormConfig<GQLVisit> = {
            type: "form",
            gqlType: "Visit",
            fields: [hostFieldConfig],
        };

        const hostOutput = generateFormField({
            gqlIntrospection: introspection,
            baseOutputFilename: "VisitForm",
            formFragmentName: "VisitFormFragment",
            config: hostFieldConfig,
            formConfig,
            gqlType: "Visit",
        });

        // Custom queryName overrides the default field-name-based name
        expect(hostOutput.code).toContain("VisitHostSelect");
        expect(hostOutput.code).not.toContain("query HostSelect");
    });

    it("throws error for empty queryName", () => {
        const schema = buildSchema(`
            type Query {
                people: PeopleConnection!
            }
            type PeopleConnection { nodes: [Person!]! }
            type Visit { id: ID! host: Person! }
            type Person { id: ID! name: String! }
            type Mutation {
                createVisit(input: VisitInput!): Visit!
                updateVisit(id: ID!, input: VisitInput!): Visit!
            }
            input VisitInput { host: ID }
        `);
        type GQLPerson = { __typename?: "Person"; id: string; name: string };
        type GQLVisit = { __typename?: "Visit"; id: string; host: GQLPerson };
        const introspection = introspectionFromSchema(schema);
        const fieldConfig: FormFieldConfig<GQLVisit> = {
            type: "asyncSelect",
            rootQuery: "people",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            queryName: "" as any,
            name: "host",
        };
        const formConfig: FormConfig<GQLVisit> = { type: "form", gqlType: "Visit", fields: [fieldConfig] };
        expect(() =>
            generateFormField({
                gqlIntrospection: introspection,
                baseOutputFilename: "VisitForm",
                formFragmentName: "VisitFormFragment",
                config: fieldConfig,
                formConfig,
                gqlType: "Visit",
            }),
        ).toThrow(/queryName/);
    });

    it("throws error for queryName with invalid characters", () => {
        const schema = buildSchema(`
            type Query {
                people: PeopleConnection!
            }
            type PeopleConnection { nodes: [Person!]! }
            type Visit { id: ID! host: Person! }
            type Person { id: ID! name: String! }
            type Mutation {
                createVisit(input: VisitInput!): Visit!
                updateVisit(id: ID!, input: VisitInput!): Visit!
            }
            input VisitInput { host: ID }
        `);
        type GQLPerson = { __typename?: "Person"; id: string; name: string };
        type GQLVisit = { __typename?: "Visit"; id: string; host: GQLPerson };
        const introspection = introspectionFromSchema(schema);
        const fieldConfig: FormFieldConfig<GQLVisit> = {
            type: "asyncSelect",
            rootQuery: "people",
            queryName: "Invalid Name!",
            name: "host",
        };
        const formConfig: FormConfig<GQLVisit> = { type: "form", gqlType: "Visit", fields: [fieldConfig] };
        expect(() =>
            generateFormField({
                gqlIntrospection: introspection,
                baseOutputFilename: "VisitForm",
                formFragmentName: "VisitFormFragment",
                config: fieldConfig,
                formConfig,
                gqlType: "Visit",
            }),
        ).toThrow(/queryName/);
    });
});
