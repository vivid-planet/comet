import { JsonLd } from "@dextinity/site-nextjs";
import type { ContentScope } from "@src/site-configs";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import { recursivelyLoadBlockData } from "@src/util/recursivelyLoadBlockData";
import { getSiteConfigForDomain } from "@src/util/siteConfig";
import type { Organization } from "schema-dts";

import { buildOrganization } from "./buildOrganization";
import type { GQLSiteSettingsFragment } from "./SiteSettings.fragment.generated";

interface Props {
    siteSettings: GQLSiteSettingsFragment;
    scope: ContentScope;
}

export async function SiteSettings({ siteSettings, scope }: Props) {
    const organizationBlockData = await recursivelyLoadBlockData({
        blockData: siteSettings.organization,
        blockType: "Organization",
        graphQLFetch: createGraphQLFetch(),
        fetch,
        scope,
    });

    const { url } = getSiteConfigForDomain(scope.domain);
    const organization = buildOrganization(organizationBlockData, url);

    if (!organization) {
        return null;
    }

    return <JsonLd<Organization> data={organization} />;
}
