import {
    DamVideoBlock,
    OneOfBlock,
    PreviewSkeleton,
    type PropsWithData,
    type SupportedBlocks,
    VimeoVideoBlock,
    withPreview,
} from "@comet/site-nextjs";
import { type MediaBlockData } from "@src/blocks.generated";
import { DamImageBlock } from "@src/common/blocks/DamImageBlock";

import { PlayPauseButton } from "../helpers/PlayPauseButton";
import { CookieSafeYouTubeVideoBlock } from "./CookieSafeYouTubeVideoBlock";

const getSupportedBlocks = (sizes: string, aspectRatio: string, fill?: boolean): SupportedBlocks => {
    return {
        image: (data) => <DamImageBlock data={data} sizes={sizes} aspectRatio={aspectRatio} fill={fill} />,
        damVideo: (data) => (
            <DamVideoBlock data={data} previewImageSizes={sizes} aspectRatio={aspectRatio} fill={fill} playPauseButton={PlayPauseButton} />
        ),
        youTubeVideo: (data) => (
            <CookieSafeYouTubeVideoBlock
                data={data}
                previewImageSizes={sizes}
                aspectRatio={aspectRatio}
                fill={fill}
                playPauseButton={PlayPauseButton}
            />
        ),
        vimeoVideo: (data) => (
            <VimeoVideoBlock data={data} previewImageSizes={sizes} aspectRatio={aspectRatio} fill={fill} playPauseButton={PlayPauseButton} />
        ),
    };
};

interface MediaBlockProps extends PropsWithData<MediaBlockData> {
    sizes?: string;
    aspectRatio: string;
    fill?: boolean;
}

export const MediaBlock = withPreview(
    ({ data, sizes = "100vw", aspectRatio, fill }: MediaBlockProps) => {
        return (
            <PreviewSkeleton type="media" hasContent={Boolean(data)}>
                <OneOfBlock data={data} supportedBlocks={getSupportedBlocks(sizes, aspectRatio, fill)} />
            </PreviewSkeleton>
        );
    },
    { label: "Media" },
);
