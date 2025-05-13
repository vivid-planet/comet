import {
    DamVideoBlock,
    OneOfBlock,
    PreviewSkeleton,
    PropsWithData,
    SupportedBlocks,
    VimeoVideoBlock,
    withPreview,
    YouTubeVideoBlock,
} from "@comet/site-next";
import { MediaBlockData } from "@src/blocks.generated";
import { DamImageBlock } from "@src/common/blocks/DamImageBlock";

const getSupportedBlocks = (sizes: string, aspectRatio: string, fill?: boolean): SupportedBlocks => {
    return {
        image: (data) => <DamImageBlock data={data} sizes={sizes} aspectRatio={aspectRatio} fill={fill} />,
        damVideo: (data) => <DamVideoBlock data={data} previewImageSizes={sizes} aspectRatio={aspectRatio} fill={fill} />,
        youTubeVideo: (data) => <YouTubeVideoBlock data={data} previewImageSizes={sizes} aspectRatio={aspectRatio} fill={fill} />,
        vimeoVideo: (data) => <VimeoVideoBlock data={data} previewImageSizes={sizes} aspectRatio={aspectRatio} fill={fill} />,
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
