import { generateImageUrl } from "@comet/site-nextjs";
import type { DamImageBlockData } from "@src/blocks.generated";

function toAbsoluteUrl(url: string, siteUrl: string): string {
    return url.startsWith("http") ? url : new URL(url, siteUrl).toString();
}

export function damImageToAbsoluteUrl(image: DamImageBlockData, siteUrl: string): string | undefined {
    const props = image.block?.props;

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
