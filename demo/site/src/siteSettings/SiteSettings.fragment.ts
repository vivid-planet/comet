import { gql } from "@dextinity/site-nextjs";

export const siteSettingsFragment = gql`
    fragment SiteSettings on SiteSettings {
        organization
    }
`;
