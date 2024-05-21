import { PreviewSkeleton, PropsWithData, withPreview } from "@comet/cms-site";
import { DamVideoBlockData } from "@src/blocks.generated";
import * as React from "react";
import styled from "styled-components";

const VideoContainer = styled.div`
    position: relative;
    aspect-ratio: 16 / 9;
    overflow: hidden;

    video {
        position: absolute;
        top: 0;
        left: 0;
        border: 0;
        width: 100%;
        height: 100%;
    }
`;

function DamVideoBlock({ data: { damFile, autoplay, loop, showControls } }: PropsWithData<DamVideoBlockData>): JSX.Element {
    if (damFile === undefined) {
        return <PreviewSkeleton type="media" hasContent={false} />;
    }

    return (
        <VideoContainer>
            <video autoPlay={autoplay} controls={showControls} loop={loop} playsInline muted={autoplay}>
                <source src={damFile.fileUrl} type={damFile.mimetype} />
            </video>
        </VideoContainer>
    );
}

export default withPreview(DamVideoBlock, { label: "Video" });
