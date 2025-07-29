import { buildSchema, introspectionFromSchema } from "graphql";

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
                fieldName: "title",
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
                    gqlName: "type",
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
});
