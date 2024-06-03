import { PreviewSkeleton, PropsWithData, withPreview } from "@comet/cms-site";
import { DamVideoBlockData } from "@src/blocks.generated";
import * as React from "react";
import styled from "styled-components";

function DamVideoBlock({ data: { damFile, autoplay, loop, showControls } }: PropsWithData<DamVideoBlockData>): JSX.Element {
    if (damFile === undefined) {
        return <PreviewSkeleton type="media" hasContent={false} />;
    }

    return (
        <Video autoPlay={autoplay} muted={autoplay} loop={loop} controls={showControls} playsInline>
            <source src={damFile.fileUrl} type={damFile.mimetype} />
        </Video>
    );
}

export default withPreview(DamVideoBlock, { label: "Video" });

const Video = styled.video`
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
`;
