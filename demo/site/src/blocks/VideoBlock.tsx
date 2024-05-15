import { PreviewSkeleton, PropsWithData, VimeoVideoBlock, withPreview, YouTubeVideoBlock } from "@comet/cms-site";
import { DamImageBlockData, DamVideoBlockData, VimeoVideoBlockData, YouTubeVideoBlockData } from "@src/blocks.generated";
import DamVideoBlock from "@src/blocks/DamVideoBlock";

const VideoBlock = withPreview(
    ({ data: { block } }: PropsWithData<DamImageBlockData>) => {
        if (!block) {
            return <PreviewSkeleton type="media" hasContent={false} />;
        }

        switch (block.type) {
            case "damVideo":
                return <DamVideoBlock data={block.props as DamVideoBlockData} />;
            case "youtubeVideo":
                return <YouTubeVideoBlock data={block.props as YouTubeVideoBlockData} />;
            case "vimeoVideo":
                return <VimeoVideoBlock data={block.props as VimeoVideoBlockData} />;
            default:
                if (process.env.NODE_ENV === "development") {
                    return (
                        <pre>
                            Unknown type ({block.type}): {JSON.stringify(block.props)}
                        </pre>
                    );
                }

                return null;
        }
    },
    { label: "Video" },
);

export { VideoBlock };
