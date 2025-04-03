import {
    DamVideoBlock,
    OneOfBlock,
    PreviewSkeleton,
    PropsWithData,
    SupportedBlocks,
    VimeoVideoBlock,
    withPreview,
    YouTubeVideoBlock,
} from "@comet/cms-site";
import { MediaBlockData } from "@src/blocks.generated";
import { DamImageBlock } from "@src/common/blocks/DamImageBlock";

const getSupportedBlocks = (sizes: string, aspectRatio: string, fill?: boolean, priority?: boolean): SupportedBlocks => {
    return {
        image: (data) => <DamImageBlock data={data} sizes={sizes} aspectRatio={aspectRatio} fill={fill} priority={priority} />,
        damVideo: (data) => <DamVideoBlock data={data} previewImageSizes={sizes} aspectRatio={aspectRatio} fill={fill} />,
        youTubeVideo: (data) => <YouTubeVideoBlock data={data} previewImageSizes={sizes} aspectRatio={aspectRatio} fill={fill} />,
        vimeoVideo: (data) => <VimeoVideoBlock data={data} previewImageSizes={sizes} aspectRatio={aspectRatio} fill={fill} />,
    };
};

interface MediaBlockProps extends PropsWithData<MediaBlockData> {
    sizes?: string;
    aspectRatio: string;
    fill?: boolean;
    priority?: boolean;
}

export const MediaBlock = withPreview(
    ({ data, sizes = "100vw", aspectRatio, fill, priority }: MediaBlockProps) => {
        return (
            <PreviewSkeleton type="media" hasContent={Boolean(data)}>
                <OneOfBlock data={data} supportedBlocks={getSupportedBlocks(sizes, aspectRatio, fill, priority)} />
            </PreviewSkeleton>
        );
    },
    { label: "Media" },
);
