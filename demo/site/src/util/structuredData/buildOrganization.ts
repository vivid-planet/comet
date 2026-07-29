import { generateImageUrl } from "@comet/site-nextjs";
import type { DamImageBlockData } from "@src/blocks.generated";
import type { Organization, WithContext } from "schema-dts";

import type { GQLSiteSettingsFragment } from "./SiteSettings.fragment.generated";

function toAbsoluteUrl(url: string, siteUrl: string): string {
    return url.startsWith("http") ? url : new URL(url, siteUrl).toString();
}

function buildLogoUrl(logo: DamImageBlockData, siteUrl: string): string | undefined {
    const props = logo.block?.props;

    if (!props) {
        return undefined;
    }

    if ("urlTemplate" in props && props.damFile?.image) {
        const { width, height } = props.damFile.image;
        const url = generateImageUrl({ src: props.urlTemplate, width }, width / height);
        return toAbsoluteUrl(url, siteUrl);
    }

    if (props.damFile?.fileUrl) {
        return toAbsoluteUrl(props.damFile.fileUrl, siteUrl);
    }

    return undefined;
}

export function buildOrganization(siteSettings: GQLSiteSettingsFragment, siteUrl: string): WithContext<Organization> | null {
    const name = siteSettings.organizationName.trim();

    if (!name) {
        return null;
    }

    const logo = buildLogoUrl(siteSettings.organizationLogo, siteUrl);
    const sameAs = siteSettings.organizationSameAs.map((url) => url.trim()).filter(Boolean);
    const description = siteSettings.organizationDescription?.trim();

    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name,
        url: siteSettings.organizationUrl?.trim() || siteUrl,
        ...(logo ? { logo } : {}),
        ...(sameAs.length > 0 ? { sameAs } : {}),
        ...(description ? { description } : {}),
    };
}
