"use client";
import * as React from "react";
import styled from "styled-components";

import { DamVideoBlockData } from "../blocks.generated";
import { withPreview } from "../iframebridge/withPreview";
import { PreviewSkeleton } from "../previewskeleton/PreviewSkeleton";
import { PropsWithData } from "./PropsWithData";

export const DamVideoBlock = withPreview(
    ({ data: { damFile, autoplay, loop, showControls } }: PropsWithData<DamVideoBlockData>): JSX.Element => {
        if (damFile === undefined) {
            return <PreviewSkeleton type="media" hasContent={false} />;
        }

        return (
            <Video autoPlay={autoplay} muted={autoplay} loop={loop} controls={showControls} playsInline>
                <source src={damFile.fileUrl} type={damFile.mimetype} />
            </Video>
        );
    },
    { label: "Video" },
);

const Video = styled.video`
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
`;
