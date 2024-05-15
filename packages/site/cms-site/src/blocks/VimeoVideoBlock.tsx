import * as React from "react";
import styled from "styled-components";

import { VimeoVideoBlockData } from "../blocks.generated";
import { PreviewSkeleton } from "../previewskeleton/PreviewSkeleton";
import { PropsWithData } from "./PropsWithData";

const isUrl = (value: string) => {
    try {
        return Boolean(new URL(value));
    } catch (e) {
        return false;
    }
};

export const VimeoVideoBlock: React.FunctionComponent<PropsWithData<VimeoVideoBlockData>> = ({ data: { vimeoIdentifier, autoplay } }) => {
    if (!vimeoIdentifier) {
        return <PreviewSkeleton type="media" hasContent={false} />;
    }

    if (isUrl(vimeoIdentifier)) {
        const regEx = /(https?:\/\/)?(www\.)?(player\.)?vimeo\.com\/?(showcase\/)*([0-9)([a-z]*\/)*([0-9]{6,11})[?]?.*/;
        const match = vimeoIdentifier.match(regEx);
        if (match && match.length == 7) {
            vimeoIdentifier = match[6];
        }
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
