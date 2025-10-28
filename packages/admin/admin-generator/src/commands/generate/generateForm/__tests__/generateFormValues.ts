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
            config,
            formValuesConfig: generatedFields.formValuesConfig,
            filterByFragmentType: "GQLProductFormFragment",
        });
        expect(formValuesType).toEqual("type FormValues = GQLProductFormFragment ;");

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

        const formValuesToGqlInput = generateFormValuesToGqlInput({ generatedFields });
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
        const formValuesToGqlInput = generateFormValuesToGqlInput({ generatedFields });
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
            config,
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
            `const initialValues = useMemo<Partial<FormValues>>(() => data?.product ? { ...filterByFragment<GQLProductFormFragment>(productFormFragment, data.product), price: String(data.product.price) } : { } , [data]);`,
        );

        const destructFormValue = generateDestructFormValueForInput({ formValuesConfig: generatedFields.formValuesConfig });
        expect(destructFormValue).toEqual("formValues");

        const formValuesToGqlInput = generateFormValuesToGqlInput({ generatedFields });
        expect(formValuesToGqlInput.replace(/\s+/g, " ")).toEqual(`const output = { ...formValues, price: parseFloat(formValues.price), };`);
    });
});
