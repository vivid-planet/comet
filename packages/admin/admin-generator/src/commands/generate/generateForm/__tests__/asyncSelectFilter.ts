import { buildSchema, introspectionFromSchema } from "graphql";

import { type FormConfig } from "../../generate-command";
import { generateForm } from "../generateForm";

describe("AsyncSelectFilter", () => {
    it("generates field with filter", async () => {
        const schema = buildSchema(`
            type Query {
                products(filter: ProductFilter): [Product!]
                productCategories: [ProductCategory!]
            }

            type Mutation {
                createProductHighlight(input: ProductHighlightInput!): ProductHighlight!
                updateProductHighlight(id: ID!, input: ProductHighlightInput!): ProductHighlight!
            }

            input ProductHighlightInput {
                product: ID
            }

            input ProductFilter {
                category: ManyToOneFilter
            }

            input ManyToOneFilter {
                isAnyOf: [ID!]
                equal: ID
                notEqual: ID
            }

            type Product {
                id: ID!
                title: String!
                category: ProductCategory
            }
            type ProductCategory {
                id: ID!
                title: String!
            }
            type ProductHighlight {
                id: ID!
                product: Product
            }
        `);
        type GQLProductCategory = {
            __typename?: "ProductCategory";
            id: string;
            name: string;
        };
        type GQLProduct = {
            __typename?: "Product";
            id: string;
            title: string;
            category: GQLProductCategory;
        };
        type GQLProductHighlight = {
            __typename?: "ProductHighlight";
            id: string;
            product: GQLProduct;
        };
        const introspection = introspectionFromSchema(schema);

        const formConfig: FormConfig<GQLProductHighlight> = {
            type: "form",
            gqlType: "ProductHighlight",
            fields: [
                {
                    type: "asyncSelectFilter",
                    rootQuery: "productCategories",
                    queryField: "product.category",
                    name: "productCategory",
                },
                {
                    type: "asyncSelect",
                    rootQuery: "products",
                    name: "product",
                    filter: {
                        type: "field",
                        fieldName: "productCategory",
                        gqlName: "category",
                    },
                },
            ],
        };

        const formOutput = generateForm(
            {
                gqlIntrospection: introspection,
                baseOutputFilename: "ProductHighlightForm",
                exportName: "ProductHighlightForm",
                targetDirectory: "/test",
            },
            formConfig,
        );
        expect(formOutput.code).toMatchSnapshot();
    });
});
