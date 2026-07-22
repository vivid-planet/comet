import { gql } from "@comet/site-nextjs";

export const siteSettingsFragment = gql`
    fragment SiteSettings on SiteSettings {
        content
    }
`;
