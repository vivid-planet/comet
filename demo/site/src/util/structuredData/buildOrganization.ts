import { generateImageUrl } from "@comet/site-nextjs";
import type { DamImageBlockData, SiteSettingsContentBlockData } from "@src/blocks.generated";
import type { Organization, WithContext } from "schema-dts";

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

export function buildOrganization(content: SiteSettingsContentBlockData, siteUrl: string): WithContext<Organization> | null {
    const { organization } = content;

    const name = organization.name.trim();

    if (!name) {
        return null;
    }

    const logo = buildLogoUrl(organization.logo, siteUrl);
    const sameAs = organization.sameAs.blocks
        .filter((block) => block.visible)
        .map((block) => block.props.url.trim())
        .filter(Boolean);
    const description = organization.description?.trim();

    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name,
        url: organization.url?.trim() || siteUrl,
        ...(logo ? { logo } : {}),
        ...(sameAs.length > 0 ? { sameAs } : {}),
        ...(description ? { description } : {}),
    };
}
