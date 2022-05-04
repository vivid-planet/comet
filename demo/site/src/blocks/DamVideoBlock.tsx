import { PreviewSkeleton, PropsWithData, withPreview } from "@comet/site-cms";
import { DamVideoBlockData } from "@src/blocks.generated";
import * as React from "react";

function DamVideoBlock({ data: { damFile, autoplay, showControls } }: PropsWithData<DamVideoBlockData>): JSX.Element {
    if (damFile === undefined) {
        return <PreviewSkeleton type="media" hasContent={false} />;
    }

    return (
        <video autoPlay={autoplay} controls={showControls} playsInline muted={autoplay}>
            <source src={damFile.fileUrl} type={damFile.mimetype} />
        </video>
    );
}

export default withPreview(DamVideoBlock, { label: "Video" });
