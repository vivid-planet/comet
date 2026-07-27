import type { SiteSettingsContentBlockData } from "@src/blocks.generated";
import type { ContentScope } from "@src/site-configs";
import { getSiteConfigForDomain } from "@src/util/getSiteConfigs";
import type { Organization, WithContext } from "schema-dts";

import { damImageToAbsoluteUrl } from "./damImageToAbsoluteUrl";

// schema-dts types `Organization` as a union that includes `string`; the node builders only ever produce the object form.
export type OrganizationNode = Exclude<Organization, string>;

export function buildOrganizationNode(content: SiteSettingsContentBlockData, scope: ContentScope): OrganizationNode | null {
    const siteUrl = getSiteConfigForDomain(scope.domain).url;
    const { organization } = content;

    const name = organization.name.trim();

    if (!name) {
        return null;
    }

    const logo = damImageToAbsoluteUrl(organization.logo, siteUrl);
    const sameAs = organization.sameAs.blocks
        .filter((block) => block.visible)
        .map((block) => block.props.url.trim())
        .filter(Boolean);
    const description = organization.description.trim();

    return {
        "@type": "Organization",
        name,
        url: organization.url.trim() || siteUrl,
        ...(logo ? { logo } : {}),
        ...(sameAs.length > 0 ? { sameAs } : {}),
        ...(description ? { description } : {}),
    };
}

export function buildOrganization(content: SiteSettingsContentBlockData, scope: ContentScope): WithContext<Organization> | null {
    const node = buildOrganizationNode(content, scope);

    if (!node) {
        return null;
    }

    return { "@context": "https://schema.org", ...node };
}
