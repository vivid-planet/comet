import * as React from "react";
import styled from "styled-components";

import { VimeoVideoBlockData } from "../blocks.generated";
import { PreviewSkeleton } from "../previewskeleton/PreviewSkeleton";
import { PropsWithData } from "./PropsWithData";

export const VimeoVideoBlock: React.FunctionComponent<PropsWithData<VimeoVideoBlockData>> = ({ data: { vimeoIdentifier, autoplay } }) => {
    if (vimeoIdentifier === undefined) {
        return null;
    }
    try {
        new URL(vimeoIdentifier);
        const splitUrl = vimeoIdentifier.split("/");
        vimeoIdentifier = splitUrl[splitUrl.length - 1];
    } catch (error) {
        // no url, but ID was specified
    }

    if (vimeoIdentifier.length === 0) {
        return <PreviewSkeleton type="media" hasContent={false} />;
    }

    return (
        <VideoContainer>
            <iframe
                src={`https://player.vimeo.com/video/${vimeoIdentifier}?autoplay=${Number(autoplay)}&muted=${Number(autoplay)}&dnt=1`}
                allow="autoplay"
                allowFullScreen
            />
        </VideoContainer>
    );
};

export const VideoContainer = styled.div`
    position: relative;
    aspect-ratio: 16 / 9;
    overflow: hidden;

    iframe {
        position: absolute;
        top: 0;
        left: 0;
        border: 0;
        width: 100%;
        height: 100%;
    }
`;
