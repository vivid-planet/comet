import { RuleTester } from "eslint";

import noGqlFragmentNameSuffix from "./no-gql-fragment-name-suffix";

const ruleTester = new RuleTester();

ruleTester.run("no-gql-fragment-name-suffix", noGqlFragmentNameSuffix, {
    valid: [
        {
            code: "const doc = gql`fragment FooFields on Foo { id }`;",
        },
        {
            code: "const doc = gql`fragment ProductForm on Product { id name }`;",
        },
        {
            code: "const doc = gql`query Foo { foo { id } }`;",
        },
        {
            // not a gql tag - should not check
            code: "const s = sql`fragment FooFragment on Foo { id }`;",
        },
        {
            code: "const doc = gql`fragment FooFields on Foo { ...BarFields }`;",
        },
    ],
    invalid: [
        {
            code: "const doc = gql`fragment FooFragment on Foo { id }`;",
            errors: [
                {
                    message:
                        "GraphQL fragment name 'FooFragment' must not end with 'Fragment'. Code generation appends 'Fragment' to the type name, which would result in a duplicated 'FragmentFragment' suffix.",
                },
            ],
        },
        {
            code: "const doc = graphql`fragment BrevoContactAttributesFragment on BrevoContact { id }`;",
            errors: [{ message: /BrevoContactAttributesFragment/ }],
        },
        {
            code: "const doc = apolloClient.gql`fragment FooFragment on Foo { id }`;",
            errors: [{ message: /FooFragment/ }],
        },
        {
            // multiple fragments in one template
            code: "const doc = gql`fragment AFragment on Foo { id } fragment BFragment on Bar { id }`;",
            errors: [{ message: /AFragment/ }, { message: /BFragment/ }],
        },
    ],
});
