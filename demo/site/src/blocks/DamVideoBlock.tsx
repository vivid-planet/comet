import { PreviewSkeleton, PropsWithData, withPreview } from "@comet/cms-site";
import { DamVideoBlockData } from "@src/blocks.generated";
import * as React from "react";

function DamVideoBlock({ data: { damFile, autoplay, loop, showControls } }: PropsWithData<DamVideoBlockData>): JSX.Element {
    if (!damFile) {
        return <PreviewSkeleton type="media" hasContent={false} />;
    }

    return (
        <video autoPlay={autoplay || false} controls={showControls || false} loop={loop || false} playsInline muted={autoplay || false}>
            <source src={damFile.fileUrl} type={damFile.mimetype} />
        </video>
    );
}

export default withPreview(DamVideoBlock, { label: "Video" });
