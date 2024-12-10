import { createImageLinkBlock, DamImageBlock } from "@comet/cms-admin";
import { LinkBlock } from "@src/common/blocks/LinkBlock";

export const ImageLinkBlock = createImageLinkBlock({ link: LinkBlock, image: DamImageBlock });
