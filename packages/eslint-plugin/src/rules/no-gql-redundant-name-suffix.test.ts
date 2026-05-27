import { RuleTester } from "eslint";

import noGqlRedundantNameSuffix from "./no-gql-redundant-name-suffix";

const ruleTester = new RuleTester();

ruleTester.run("no-gql-redundant-name-suffix", noGqlRedundantNameSuffix, {
    valid: [
        { code: "const doc = gql`fragment FooFields on Foo { id }`;" },
        { code: "const doc = gql`fragment ProductForm on Product { id name }`;" },
        { code: "const doc = gql`query Foo { foo { id } }`;" },
        { code: "const doc = gql`mutation CreateFoo { createFoo { id } }`;" },
        { code: "const doc = gql`subscription FooUpdated { fooUpdated { id } }`;" },
        // not a gql tag - should not check
        { code: "const s = sql`fragment FooFragment on Foo { id }`;" },
        { code: "const doc = gql`fragment FooFields on Foo { ...BarFields }`;" },
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
            code: "const doc = gql`query FooQuery { foo { id } }`;",
            errors: [{ message: /query name 'FooQuery'.*'Query'.*'QueryQuery'/ }],
        },
        {
            code: "const doc = gql`query BrevoContactsQuery { brevoContacts { id } }`;",
            errors: [{ message: /BrevoContactsQuery/ }],
        },
        {
            code: "const doc = gql`mutation FooMutation { foo { id } }`;",
            errors: [{ message: /mutation name 'FooMutation'.*'Mutation'.*'MutationMutation'/ }],
        },
        {
            code: "const doc = gql`mutation CreateFooMutation { createFoo { id } }`;",
            errors: [{ message: /CreateFooMutation/ }],
        },
        {
            code: "const doc = gql`subscription FooSubscription { fooUpdated { id } }`;",
            errors: [{ message: /subscription name 'FooSubscription'.*'Subscription'.*'SubscriptionSubscription'/ }],
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
            // multiple operations in one template
            code: "const doc = gql`query FooQuery { foo { id } } fragment BarFragment on Bar { id }`;",
            errors: [{ message: /FooQuery/ }, { message: /BarFragment/ }],
        },
    ],
});
