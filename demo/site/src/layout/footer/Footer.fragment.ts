import { gql } from "@comet/site-nextjs";

export const footerFragment = gql`
    fragment Footer on Footer {
        content
    }
`;
