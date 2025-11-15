import { VideoPreviewImage as SiteReactVideoPreviewImage, type VideoPreviewImageProps as SiteReactVideoPreviewImageProps } from "@comet/site-react";

import { PixelImageBlock } from "../PixelImageBlock";

type Props = Omit<SiteReactVideoPreviewImageProps, "renderImage">;
export function VideoPreviewImage(props: Props) {
    return <SiteReactVideoPreviewImage {...props} renderImage={(props) => <PixelImageBlock {...props} />} />;
}
