import { graphql } from "@src/gql";

export const footerFragment = graphql(/* GraphQL */ `
    fragment Footer on Footer {
        content
    }
`);
