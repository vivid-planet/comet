import { PropsWithData, withPreview } from "@comet/cms-site";
import { ImageLinkBlockData } from "@src/blocks.generated";
import { DamImageBlock } from "@src/common/blocks/DamImageBlock";
import { LinkBlock } from "@src/common/blocks/LinkBlock";

export const ImageLinkBlock = withPreview(
    ({ data: { link, image } }: PropsWithData<ImageLinkBlockData>) => {
        return (
            <LinkBlock data={link}>
                <DamImageBlock data={image} aspectRatio="1x1" />
            </LinkBlock>
        );
    },
    { label: "Image/Link" },
);
