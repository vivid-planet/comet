import { calculateInheritAspectRatio, generateImageUrl } from "@dextinity/site-nextjs";
import type { DamImageBlockData, OrganizationBlockData } from "@src/blocks.generated";
import dextinityConfig from "@src/dextinity-config.json" with { type: "json" };
import type { Organization, WithContext } from "schema-dts";

const validImageWidths = [...dextinityConfig.images.imageSizes, ...dextinityConfig.images.deviceSizes].sort((a, b) => a - b);

function getOptimalAllowedImageWidth(desiredWidth: number): number {
    const largestValidWidth = validImageWidths[validImageWidths.length - 1];
    return validImageWidths.find((validWidth) => validWidth >= desiredWidth) ?? largestValidWidth;
}

function toAbsoluteUrl(url: string, siteUrl: string): string {
    return url.startsWith("http") ? url : new URL(url, siteUrl).toString();
}

function buildLogoUrl(logo: DamImageBlockData, siteUrl: string): string | undefined {
    const props = logo.block?.props;

    if (!props) {
        return undefined;
    }

    if ("urlTemplate" in props && props.damFile?.image) {
        const { image } = props.damFile;
        const aspectRatio = calculateInheritAspectRatio(image, props.cropArea ?? image.cropArea);
        const url = generateImageUrl({ src: props.urlTemplate, width: getOptimalAllowedImageWidth(image.width) }, aspectRatio);
        return toAbsoluteUrl(url, siteUrl);
    }

    if (props.damFile?.fileUrl) {
        return toAbsoluteUrl(props.damFile.fileUrl, siteUrl);
    }

    return undefined;
}

export function buildOrganization(organization: OrganizationBlockData, siteUrl: string): WithContext<Organization> | null {
    const name = organization.name.trim();

    if (!name) {
        return null;
    }

    const logo = buildLogoUrl(organization.logo, siteUrl);
    const sameAs = organization.sameAs.blocks
        .filter((block) => block.visible)
        .map((block) => block.props.url.trim())
        .filter(Boolean);
    const description = organization.description.trim();

    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name,
        url: organization.url.trim() || siteUrl,
        ...(logo ? { logo } : {}),
        ...(sameAs.length > 0 ? { sameAs } : {}),
        ...(description ? { description } : {}),
    };
}
