import { buildSchema, introspectionFromSchema } from "graphql";

import { type FormConfig } from "../../generate-command";
import { generateFields } from "../generateFields";
import {
    generateDestructFormValueForInput,
    generateFormValuesToGqlInput,
    generateFormValuesType,
    generateInitialValues,
} from "../generateFormValues";

describe("generateFormValues", () => {
    it("generates standard case without fields that need special handling", async () => {
        const schema = buildSchema(`
                    type Query {
                        products: [Product]!
                    } 
        
                    type Product {
                        id: ID!
                        name: String!
                    }
                  
                    type Mutation {
                        createProduct(input: ProductInput!): Product!
                        updateProduct(id: ID!, input: ProductInput!): Product!
                    }
        
                    input ProductInput {
                        title: String
                    }
                `);

        type GQLProduct = {
            __typename?: "Product";
            id: string;
            name: string;
        };

        const config: FormConfig<GQLProduct> = {
            type: "form",
            gqlType: "Product",
            fields: [
                {
                    type: "text",
                    name: "name",
                },
            ],
        };

        const introspection = introspectionFromSchema(schema);

        const generatedFields = generateFields({
            gqlIntrospection: introspection,
            baseOutputFilename: "ProductForm",
            fields: config.fields,
            formFragmentName: "ProductFormFragment",
            formConfig: config,
            gqlType: "Product",
        });
        const formValuesType = generateFormValuesType({
            formValuesConfig: generatedFields.formValuesConfig,
            filterByFragmentType: "GQLProductFormFragment",
        });
        expect(formValuesType).toEqual("type FormValues = GQLProductFormFragment;");

        const initialValues = generateInitialValues({
            config,
            formValuesConfig: generatedFields.formValuesConfig,
            filterByFragmentType: "GQLProductFormFragment",
        });
        expect(initialValues.replace(/\s+/g, " ")).toEqual(
            `const initialValues = useMemo<Partial<FormValues>>(() => data?.product ? { ...filterByFragment<GQLProductFormFragment>(productFormFragment, data.product), } : { } , [data]);`,
        );

        const destructFormValue = generateDestructFormValueForInput({ formValuesConfig: generatedFields.formValuesConfig });
        expect(destructFormValue).toEqual("formValues");

        const formValuesToGqlInput = generateFormValuesToGqlInput({ formValuesConfig: generatedFields.formValuesConfig });
        expect(formValuesToGqlInput.replace(/\s+/g, " ")).toEqual(`const output = { ...formValues, };`);
    });

    it("generates output null required text input", async () => {
        const schema = buildSchema(`
                    type Query {
                        products: [Product]!
                    } 
        
                    type Product {
                        id: ID!
                        name: String
                    }
                  
                    type Mutation {
                        createProduct(input: ProductInput!): Product!
                        updateProduct(id: ID!, input: ProductInput!): Product!
                    }
        
                    input ProductInput {
                        title: String
                    }
                `);

        type GQLProduct = {
            __typename?: "Product";
            id: string;
            name: string;
        };

        const config: FormConfig<GQLProduct> = {
            type: "form",
            gqlType: "Product",
            fields: [
                {
                    type: "text",
                    name: "name",
                },
            ],
        };

        const introspection = introspectionFromSchema(schema);

        const generatedFields = generateFields({
            gqlIntrospection: introspection,
            baseOutputFilename: "ProductForm",
            fields: config.fields,
            formFragmentName: "ProductFormFragment",
            formConfig: config,
            gqlType: "Product",
        });
        const formValuesToGqlInput = generateFormValuesToGqlInput({ formValuesConfig: generatedFields.formValuesConfig });
        expect(formValuesToGqlInput.replace(/\s+/g, " ")).toEqual(`const output = { ...formValues, name: formValues.name ?? null, };`);
    });

    it("generates string number for number input", async () => {
        const schema = buildSchema(`
                    type Query {
                        products: [Product]!
                    } 
        
                    type Product {
                        id: ID!
                        price: Float!
                    }
                  
                    type Mutation {
                        createProduct(input: ProductInput!): Product!
                        updateProduct(id: ID!, input: ProductInput!): Product!
                    }
        
                    input ProductInput {
                        price: Float
                    }
                `);

        type GQLProduct = {
            __typename?: "Product";
            id: string;
            price: number;
        };

        const config: FormConfig<GQLProduct> = {
            type: "form",
            gqlType: "Product",
            fields: [
                {
                    type: "number",
                    name: "price",
                },
            ],
        };

        const introspection = introspectionFromSchema(schema);

        const generatedFields = generateFields({
            gqlIntrospection: introspection,
            baseOutputFilename: "ProductForm",
            fields: config.fields,
            formFragmentName: "ProductFormFragment",
            formConfig: config,
            gqlType: "Product",
        });
        const formValuesType = generateFormValuesType({
            formValuesConfig: generatedFields.formValuesConfig,
            filterByFragmentType: "GQLProductFormFragment",
        });
        expect(formValuesType.replace(/\s+/g, " ")).toEqual('type FormValues = Omit<GQLProductFormFragment, "price"> & { price: string; };');

        const initialValues = generateInitialValues({
            config,
            formValuesConfig: generatedFields.formValuesConfig,
            filterByFragmentType: "GQLProductFormFragment",
        });
        expect(initialValues.replace(/\s+/g, " ")).toEqual(
            `const initialValues = useMemo<Partial<FormValues>>(() => data?.product ? { ...filterByFragment<GQLProductFormFragment>(productFormFragment, data.product), price: String(data.product.price), } : { } , [data]);`,
        );

        const destructFormValue = generateDestructFormValueForInput({ formValuesConfig: generatedFields.formValuesConfig });
        expect(destructFormValue).toEqual("formValues");

        const formValuesToGqlInput = generateFormValuesToGqlInput({ formValuesConfig: generatedFields.formValuesConfig });
        expect(formValuesToGqlInput.replace(/\s+/g, " ")).toEqual(`const output = { ...formValues, price: parseFloat(formValues.price), };`);
    });

    describe("nested fields", () => {
        const schema = buildSchema(`
                    type Query {
                        products: [Product]!
                    } 
        
                    type Product {
                        id: ID!
                        address: Address!
                    }

                    type Address {
                        street: String
                        city: String!
                        zip: Int!
                    }

                    type Mutation {
                        createProduct(input: ProductInput!): Product!
                        updateProduct(id: ID!, input: ProductInput!): Product!
                    }
        
                    input ProductInput {
                        price: Float
                        address: AddressInput
                    }

                    input AddressInput {
                        street: String
                        city: String
                        zip: Int
                    }
                `);

        type GQLProduct = {
            __typename?: "Product";
            id: string;
            address: {
                __typename?: "Address";
                street: string;
                city: string;
                zip: number;
            };
        };
        const introspection = introspectionFromSchema(schema);

        it("generates nested text input that doesn't need special treatment", async () => {
            const config: FormConfig<GQLProduct> = {
                type: "form",
                gqlType: "Product",
                fields: [
                    {
                        type: "text",
                        name: "address.city",
                    },
                ],
            };

            const generatedFields = generateFields({
                gqlIntrospection: introspection,
                baseOutputFilename: "ProductForm",
                fields: config.fields,
                formFragmentName: "ProductFormFragment",
                formConfig: config,
                gqlType: "Product",
            });
            const formValuesType = generateFormValuesType({
                formValuesConfig: generatedFields.formValuesConfig,
                filterByFragmentType: "GQLProductFormFragment",
            });
            expect(formValuesType.replace(/\s+/g, " ")).toEqual("type FormValues = GQLProductFormFragment;");

            const initialValues = generateInitialValues({
                config,
                formValuesConfig: generatedFields.formValuesConfig,
                filterByFragmentType: "GQLProductFormFragment",
            });
            expect(initialValues.replace(/\s+/g, " ")).toEqual(
                `const initialValues = useMemo<Partial<FormValues>>(() => data?.product ? { ...filterByFragment<GQLProductFormFragment>(productFormFragment, data.product), } : { } , [data]);`,
            );

            const destructFormValue = generateDestructFormValueForInput({ formValuesConfig: generatedFields.formValuesConfig });
            expect(destructFormValue).toEqual("formValues");

            const formValuesToGqlInput = generateFormValuesToGqlInput({ formValuesConfig: generatedFields.formValuesConfig });
            expect(formValuesToGqlInput.replace(/\s+/g, " ")).toEqual(`const output = { ...formValues, };`);
        });

        it("generates nested number input", async () => {
            const config: FormConfig<GQLProduct> = {
                type: "form",
                gqlType: "Product",
                fields: [
                    {
                        type: "text",
                        name: "address.city",
                    },
                    {
                        type: "number",
                        name: "address.zip",
                    },
                ],
            };

            const generatedFields = generateFields({
                gqlIntrospection: introspection,
                baseOutputFilename: "ProductForm",
                fields: config.fields,
                formFragmentName: "ProductFormFragment",
                formConfig: config,
                gqlType: "Product",
            });
            const formValuesType = generateFormValuesType({
                formValuesConfig: generatedFields.formValuesConfig,
                filterByFragmentType: "GQLProductFormFragment",
            });
            expect(formValuesType.replace(/\s+/g, " ")).toEqual(
                'type FormValues = Omit<GQLProductFormFragment, "address"> & { address: Omit<GQLProductFormFragment["address"], "zip"> & { zip: string; } };',
            );

            const initialValues = generateInitialValues({
                config,
                formValuesConfig: generatedFields.formValuesConfig,
                filterByFragmentType: "GQLProductFormFragment",
            });
            expect(initialValues.replace(/\s+/g, " ")).toEqual(
                `const initialValues = useMemo<Partial<FormValues>>(() => data?.product ? { ...filterByFragment<GQLProductFormFragment>(productFormFragment, data.product), address: { ...data.product.address, zip: String(data.product.address.zip), }, } : { } , [data]);`,
            );

            const destructFormValue = generateDestructFormValueForInput({ formValuesConfig: generatedFields.formValuesConfig });
            expect(destructFormValue).toEqual("formValues");

            const formValuesToGqlInput = generateFormValuesToGqlInput({ formValuesConfig: generatedFields.formValuesConfig });
            expect(formValuesToGqlInput.replace(/\s+/g, " ")).toEqual(
                `const output = { ...formValues, address: { ...formValues.address, zip: parseFloat(formValues.address.zip), }, };`,
            );
        });
    });

    describe("generateFormValuesType unit tests", () => {
        it("generates type with only fragment", () => {
            expect(
                generateFormValuesType({
                    formValuesConfig: [
                        {
                            fieldName: "foo",
                        },
                    ],
                    filterByFragmentType: "GQLProductFormFragment",
                }),
            ).toEqual(`type FormValues = GQLProductFormFragment;`);
        });
        it("generates type with added field", () => {
            expect(
                generateFormValuesType({
                    formValuesConfig: [
                        {
                            fieldName: "foo",
                            typeCode: { nullable: false, type: "string" },
                        },
                    ],
                    filterByFragmentType: "GQLProductFormFragment",
                }),
            ).toEqual(`type FormValues = GQLProductFormFragment & { foo: string;  };`);
        });
        it("generates type with added nullable field", () => {
            expect(
                generateFormValuesType({
                    formValuesConfig: [
                        {
                            fieldName: "foo",
                            typeCode: { nullable: true, type: "string" },
                        },
                    ],
                    filterByFragmentType: "GQLProductFormFragment",
                }),
            ).toEqual(`type FormValues = GQLProductFormFragment & { foo?: string;  };`);
        });
        it("generates type with omitted field", () => {
            expect(
                generateFormValuesType({
                    formValuesConfig: [
                        {
                            fieldName: "foo",
                            omitFromFragmentType: true,
                        },
                    ],
                    filterByFragmentType: "GQLProductFormFragment",
                }),
            ).toEqual(`type FormValues = Omit<GQLProductFormFragment, "foo">;`);
        });
        it("generates type with omitted and field", () => {
            expect(
                generateFormValuesType({
                    formValuesConfig: [
                        {
                            fieldName: "foo",
                            omitFromFragmentType: true,
                            typeCode: { nullable: false, type: "string" },
                        },
                    ],
                    filterByFragmentType: "GQLProductFormFragment",
                }),
            ).toEqual(`type FormValues = Omit<GQLProductFormFragment, "foo"> & { foo: string;  };`);
        });
        it("generates type with nested added field", () => {
            expect(
                generateFormValuesType({
                    formValuesConfig: [
                        {
                            fieldName: "foo.bar",
                            typeCode: { nullable: false, type: "string" },
                        },
                    ],
                    filterByFragmentType: "GQLProductFormFragment",
                }),
            ).toEqual(`type FormValues = Omit<GQLProductFormFragment, "foo"> & { foo: GQLProductFormFragment["foo"] & { bar: string;  } };`);
        });
        it("generates type with nested omitted field", () => {
            expect(
                generateFormValuesType({
                    formValuesConfig: [
                        {
                            fieldName: "foo.bar",
                            omitFromFragmentType: true,
                        },
                    ],
                    filterByFragmentType: "GQLProductFormFragment",
                }),
            ).toEqual(`type FormValues = Omit<GQLProductFormFragment, "foo"> & { foo: Omit<GQLProductFormFragment["foo"], "bar"> };`);
        });
        it("generates type with nested omitted and added field", () => {
            expect(
                generateFormValuesType({
                    formValuesConfig: [
                        {
                            fieldName: "foo.bar",
                            omitFromFragmentType: true,
                            typeCode: { nullable: false, type: "string" },
                        },
                    ],
                    filterByFragmentType: "GQLProductFormFragment",
                }),
            ).toEqual(
                `type FormValues = Omit<GQLProductFormFragment, "foo"> & { foo: Omit<GQLProductFormFragment["foo"], "bar"> & { bar: string;  } };`,
            );
        });
        it("generates type with nested but not omitted or added field", () => {
            expect(
                generateFormValuesType({
                    formValuesConfig: [
                        {
                            fieldName: "foo.bar",
                        },
                    ],
                    filterByFragmentType: "GQLProductFormFragment",
                }),
            ).toEqual(`type FormValues = GQLProductFormFragment;`);
        });
    });

    describe("generateInitialValues code unit tests", () => {
        it("generates code with no special fields", () => {
            expect(
                generateInitialValues({
                    formValuesConfig: [
                        {
                            fieldName: "foo",
                        },
                    ],
                    filterByFragmentType: "GQLProductFormFragment",
                    config: { gqlType: "Product", mode: "all" },
                }).replace(/\s+/g, " "),
            ).toEqual(
                `const initialValues = useMemo<Partial<FormValues>>(() => data?.product ? { ...filterByFragment<GQLProductFormFragment>(productFormFragment, data.product), } : { } , [data]);`,
            );
        });
        it("generates code with default value with no special fields", () => {
            expect(
                generateInitialValues({
                    formValuesConfig: [
                        {
                            fieldName: "foo",
                        },
                    ],
                    filterByFragmentType: "GQLProductFormFragment",
                    config: { gqlType: "Product", mode: "add" },
                }).replace(/\s+/g, " "),
            ).toEqual(`const initialValues = { };`);
        });
        it("generates code with string conversion for field", () => {
            expect(
                generateInitialValues({
                    formValuesConfig: [
                        {
                            fieldName: "foo",
                            initializationCode: "String(data.product.foo)",
                        },
                    ],
                    filterByFragmentType: "GQLProductFormFragment",
                    config: { gqlType: "Product", mode: "all" },
                }).replace(/\s+/g, " "),
            ).toEqual(
                `const initialValues = useMemo<Partial<FormValues>>(() => data?.product ? { ...filterByFragment<GQLProductFormFragment>(productFormFragment, data.product), foo: String(data.product.foo), } : { } , [data]);`,
            );
        });
        it("generates code with default value for field", () => {
            expect(
                generateInitialValues({
                    formValuesConfig: [
                        {
                            fieldName: "foo",
                            defaultInitializationCode: "true",
                        },
                    ],
                    filterByFragmentType: "GQLProductFormFragment",
                    config: { gqlType: "Product", mode: "all" },
                }).replace(/\s+/g, " "),
            ).toEqual(
                `const initialValues = useMemo<Partial<FormValues>>(() => data?.product ? { ...filterByFragment<GQLProductFormFragment>(productFormFragment, data.product), } : { foo: true, } , [data]);`,
            );
        });
        it("generates code with default value for field in add mode", () => {
            expect(
                generateInitialValues({
                    formValuesConfig: [
                        {
                            fieldName: "foo",
                            defaultInitializationCode: "true",
                        },
                    ],
                    filterByFragmentType: "GQLProductFormFragment",
                    config: { gqlType: "Product", mode: "add" },
                }).replace(/\s+/g, " "),
            ).toEqual(`const initialValues = { foo: true, };`);
        });
        it("generates code with default value for nested field", () => {
            expect(
                generateInitialValues({
                    formValuesConfig: [
                        {
                            fieldName: "foo.bar",
                            defaultInitializationCode: "true",
                        },
                    ],
                    filterByFragmentType: "GQLProductFormFragment",
                    config: { gqlType: "Product", mode: "all" },
                }).replace(/\s+/g, " "),
            ).toEqual(
                `const initialValues = useMemo<Partial<FormValues>>(() => data?.product ? { ...filterByFragment<GQLProductFormFragment>(productFormFragment, data.product), } : { foo: { bar: true, }, } , [data]);`,
            );
        });
        it("generates code string conversion for nested field", () => {
            expect(
                generateInitialValues({
                    formValuesConfig: [
                        {
                            fieldName: "foo.bar",
                            initializationCode: "String(data.product.foo.bar)",
                        },
                    ],
                    filterByFragmentType: "GQLProductFormFragment",
                    config: { gqlType: "Product", mode: "all" },
                }).replace(/\s+/g, " "),
            ).toEqual(
                `const initialValues = useMemo<Partial<FormValues>>(() => data?.product ? { ...filterByFragment<GQLProductFormFragment>(productFormFragment, data.product), foo: { ...data.product.foo, bar: String(data.product.foo.bar), }, } : { } , [data]);`,
            );
        });
        it("generates code with wrapInitializationCode for field", () => {
            expect(
                generateInitialValues({
                    formValuesConfig: [
                        {
                            fieldName: "foo",
                            wrapInitializationCode: "data.product.foo ? $inner : undefined",
                        },
                        {
                            fieldName: "foo.bar",
                            initializationCode: "String(data.product.foo.bar)",
                        },
                    ],
                    filterByFragmentType: "GQLProductFormFragment",
                    config: { gqlType: "Product", mode: "all" },
                }).replace(/\s+/g, " "),
            ).toEqual(
                `const initialValues = useMemo<Partial<FormValues>>(() => data?.product ? { ...filterByFragment<GQLProductFormFragment>(productFormFragment, data.product), foo: data.product.foo ? { ...data.product.foo, bar: String(data.product.foo.bar), } : undefined, } : { } , [data]);`,
            );
        });
        it("generates code with wrapInitializationCode for dimensions field", () => {
            expect(
                generateInitialValues({
                    formValuesConfig: [
                        {
                            fieldName: "dimensions.width",
                            initializationCode: "String(data.product.dimensions.width)",
                        },
                        {
                            fieldName: "dimensionsEnabled",
                            initializationCode: "!!data.product.dimensions",
                        },
                        {
                            fieldName: "dimensions",
                            wrapInitializationCode: "data.product.dimensions ? $inner : undefined",
                        },
                    ],
                    filterByFragmentType: "GQLProductFormFragment",
                    config: { gqlType: "Product", mode: "all" },
                }).replace(/\s+/g, " "),
            ).toEqual(
                `const initialValues = useMemo<Partial<FormValues>>(() => data?.product ?
                    { ...filterByFragment<GQLProductFormFragment>(productFormFragment, data.product),
                     dimensions: data.product.dimensions ? { ...data.product.dimensions, width: String(data.product.dimensions.width), } : undefined,
                     dimensionsEnabled: !!data.product.dimensions,
                     } : { } , [data]);`.replace(/\s+/g, " "),
            );
        });
    });

    describe("generateFormValuesToGqlInput code unit tests", () => {
        it("generates code with no special fields", () => {
            expect(
                generateFormValuesToGqlInput({
                    formValuesConfig: [
                        {
                            fieldName: "foo",
                        },
                    ],
                }).replace(/\s+/g, " "),
            ).toEqual(`const output = { ...formValues, };`);
        });
        it("generates code with float conversion for field", () => {
            expect(
                generateFormValuesToGqlInput({
                    formValuesConfig: [
                        {
                            fieldName: "foo",
                            formValueToGqlInputCode: "parseFloat(data.product.foo)",
                        },
                    ],
                }).replace(/\s+/g, " "),
            ).toEqual(`const output = { ...formValues, foo: parseFloat(data.product.foo), };`);
        });
        it("generates code with float conversion for two fields", () => {
            expect(
                generateFormValuesToGqlInput({
                    formValuesConfig: [
                        {
                            fieldName: "foo",
                            formValueToGqlInputCode: "parseFloat(data.product.foo)",
                        },
                        {
                            fieldName: "bar",
                            formValueToGqlInputCode: "parseFloat(data.product.bar)",
                        },
                    ],
                }).replace(/\s+/g, " "),
            ).toEqual(`const output = { ...formValues, foo: parseFloat(data.product.foo), bar: parseFloat(data.product.bar), };`);
        });
        it("generates code with float conversion for nested field", () => {
            expect(
                generateFormValuesToGqlInput({
                    formValuesConfig: [
                        {
                            fieldName: "foo.bar",
                            formValueToGqlInputCode: "parseFloat(formValues.foo.bar)",
                        },
                    ],
                }).replace(/\s+/g, " "),
            ).toEqual(`const output = { ...formValues, foo: { ...formValues.foo, bar: parseFloat(formValues.foo.bar), }, };`);
        });
        it("generates code with no conversion for nested field", () => {
            expect(
                generateFormValuesToGqlInput({
                    formValuesConfig: [
                        {
                            fieldName: "foo.bar",
                        },
                    ],
                }).replace(/\s+/g, " "),
            ).toEqual(`const output = { ...formValues, };`);
        });
        it("generates code with wrapFormValueToGqlInputCode for field", () => {
            expect(
                generateFormValuesToGqlInput({
                    formValuesConfig: [
                        {
                            fieldName: "foo",
                            wrapFormValueToGqlInputCode: "formValues.fooEnabled && formValues.foo ? $inner : null",
                        },
                        {
                            fieldName: "foo.bar",
                            formValueToGqlInputCode: "parseFloat(formValues.foo.bar)",
                        },
                    ],
                }).replace(/\s+/g, " "),
            ).toEqual(
                `const output = { ...formValues, foo: formValues.fooEnabled && formValues.foo ? { ...formValues.foo, bar: parseFloat(formValues.foo.bar), } : null, };`,
            );
        });
        it("generates code for issue with wrapFormValueToGqlInputCode", () => {
            expect(
                generateFormValuesToGqlInput({
                    formValuesConfig: [
                        {
                            fieldName: "dimensions.width",
                            formValueToGqlInputCode: "parseFloat(formValues.dimensions.width)",
                        },
                        {
                            fieldName: "dimensionsEnabled",
                        },
                        {
                            fieldName: "dimensions",
                            wrapFormValueToGqlInputCode: "formValues.dimensionsEnabled && formValues.dimensions ? $inner : null",
                        },
                        {
                            fieldName: "availableSince",
                            formValueToGqlInputCode: "formValues.availableSince ?? null",
                        },
                    ],
                }).replace(/\s+/g, " "),
            ).toEqual(
                `const output = { ...formValues, dimensions: formValues.dimensionsEnabled && formValues.dimensions ? { ...formValues.dimensions, width: parseFloat(formValues.dimensions.width), } : null, availableSince: formValues.availableSince ?? null, };`,
            );
        });
    });
});
