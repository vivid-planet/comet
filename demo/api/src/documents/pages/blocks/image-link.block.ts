import { createImageLinkBlock, DamImageBlock } from "@comet/cms-api";
import { LinkBlock } from "@src/common/blocks/link.block";

export const ImageLinkBlock = createImageLinkBlock({ link: LinkBlock, image: DamImageBlock });
