import { RuleTester } from "eslint";

import graphqlNamingConvention from "./graphql-naming-convention";

const ruleTester = new RuleTester();

ruleTester.run("operation names must not have a forbidden suffix", graphqlNamingConvention, {
    valid: [
        { code: "const x = gql`query Products { products { id } }`;" },
        { code: "const x = gql`mutation CreateProduct { createProduct { id } }`;" },
        { code: "const x = gql`subscription ProductChanges { productChanges { id } }`;" },
        // Anonymous operations have no name to check.
        { code: "const x = gql`query { products { id } }`;" },
        // Only the configured tags hold GraphQL documents.
        { code: "const x = sql`query ProductsQuery { products { id } }`;" },
        // A forbidden suffix on its own isn't a suffix.
        { code: "const x = gql`query Query { products { id } }`;" },
    ],
    invalid: [
        {
            code: "const x = gql`query ProductsQuery { products { id } }`;",
            errors: [{ message: 'Forbidden suffix "Query" in query name "ProductsQuery"' }],
        },
        {
            code: "const x = gql`mutation CreateProductMutation { createProduct { id } }`;",
            errors: [{ message: 'Forbidden suffix "Mutation" in mutation name "CreateProductMutation"' }],
        },
        {
            code: "const x = gql`subscription ProductChangesSubscription { productChanges { id } }`;",
            errors: [{ message: 'Forbidden suffix "Subscription" in subscription name "ProductChangesSubscription"' }],
        },
        {
            code: "const x = graphql`query ProductsQuery { products { id } }`;",
            errors: [{ message: 'Forbidden suffix "Query" in query name "ProductsQuery"' }],
        },
    ],
});

ruleTester.run("fragment names must not have a forbidden suffix", graphqlNamingConvention, {
    valid: [
        { code: "const x = gql`fragment Product on Product { id }`;" },
        // Comments and strings don't declare fragments.
        { code: "const x = gql`# fragment ProductFragment on Product\nfragment Product on Product { id }`;" },
        { code: 'const x = gql`query Products($name: String = "fragment ProductFragment") { products { id } }`;' },
    ],
    invalid: [
        {
            code: "const x = gql`fragment ProductFragment on Product { id }`;",
            errors: [{ message: 'Forbidden suffix "Fragment" in fragment name "ProductFragment"' }],
        },
    ],
});

ruleTester.run("interpolated documents are checked", graphqlNamingConvention, {
    valid: [{ code: "const x = gql`query Products { products { ...Product } } ${productFragment}`;" }],
    invalid: [
        {
            code: "const x = gql`query ProductsQuery { products { ...Product } } ${productFragment}`;",
            errors: [{ message: 'Forbidden suffix "Query" in query name "ProductsQuery"' }],
        },
    ],
});

ruleTester.run("forbidden suffixes and tags are configurable", graphqlNamingConvention, {
    valid: [
        { code: "const x = gql`query ProductsQuery { products { id } }`;", options: [{ operationForbiddenSuffixes: [] }] },
        { code: "const x = gql`fragment ProductFragment on Product { id }`;", options: [{ fragmentForbiddenSuffixes: [] }] },
        { code: "const x = gql`query ProductsQuery { products { id } }`;", options: [{ tags: ["graphql"] }] },
    ],
    invalid: [
        {
            code: "const x = gql`query ProductsDocument { products { id } }`;",
            options: [{ operationForbiddenSuffixes: ["Document"] }],
            errors: [{ message: 'Forbidden suffix "Document" in query name "ProductsDocument"' }],
        },
        {
            code: "const x = sql`query ProductsQuery { products { id } }`;",
            options: [{ tags: ["sql"] }],
            errors: [{ message: 'Forbidden suffix "Query" in query name "ProductsQuery"' }],
        },
    ],
});
