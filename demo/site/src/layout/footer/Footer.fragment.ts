import { gql } from "@comet/site-next";

export const footerFragment = gql`
    fragment Footer on Footer {
        content
    }
`;
