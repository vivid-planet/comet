import { buildSchema, introspectionFromSchema } from "graphql";

import type { FormConfig, FormFieldConfig } from "../../generate-command";
import { generateFormField } from "../generateFormField";
import { generateInitialValues } from "../generateFormValues";

const schema = buildSchema(`
    type Query {
        products: [Product!]!
    } 

    type Product {
        id: ID!
        title: String!
    }
    
    type Mutation {
        createProduct(input: ProductInput!): Product!
    }

    input ProductInput {
        title: String!
    }
`);

type GQLProduct = {
    __typename?: "Product";
    id: string;
    title: string;
};

describe("staticInitialValue", () => {
    it("should generate simple date field with LocalType scalar", async () => {
        const fieldConfig: FormFieldConfig<GQLProduct> = {
            type: "text",
            name: "title",
            initialValue: "Default Product Title",
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
        expect(formOutput.formValuesConfig).toMatchSnapshot();

        const initialValuesCode = generateInitialValues({
            mode: "edit",
            filterByFragmentType: "GQLProductFragment",
            gqlIntrospection: introspection,
            formValuesConfig: formOutput.formValuesConfig,
            gqlType: "Product",
        });
        expect(initialValuesCode).toMatchSnapshot();
    });
});
