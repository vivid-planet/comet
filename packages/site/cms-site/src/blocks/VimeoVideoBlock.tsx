import * as React from "react";

import { VimeoVideoBlockData } from "../blocks.generated";
import { withPreview } from "../iframebridge/withPreview";
import { PreviewSkeleton } from "../previewskeleton/PreviewSkeleton";
import { getHeightInPercentForAspectRatio, VideoContainer } from "./helpers";
import { PropsWithData } from "./PropsWithData";

function parseVimeoIdentifier(vimeoIdentifier: string): string | undefined {
    const urlRegEx = /^(https?:\/\/)?((www\.|player\.)?vimeo\.com\/?(showcase\/)*([0-9a-z]*\/)*([0-9]{6,11})[?]?.*)$/;
    const idRegEx = /^([0-9]{6,11})$/;

    const urlRegExMatch = vimeoIdentifier.match(urlRegEx);
    const idRegExMatch = vimeoIdentifier.match(idRegEx);

    if (!urlRegExMatch && !idRegExMatch) return undefined;

    if (urlRegExMatch) {
        return urlRegExMatch[6];
    } else if (idRegExMatch) {
        return idRegExMatch[1];
    }
}

export const VimeoVideoBlock = withPreview(
    ({ data: { vimeoIdentifier, loop, showControls, aspectRatio, autoplay } }: PropsWithData<VimeoVideoBlockData>) => {
        if (!vimeoIdentifier) return <PreviewSkeleton type="media" hasContent={false} />;

        const identifier = parseVimeoIdentifier(vimeoIdentifier);

        const searchParams = new URLSearchParams();

        searchParams.append("autoplay", Number(autoplay).toString());
        autoplay && searchParams.append("muted", "1");

        searchParams.append("loop", Number(loop).toString());

        searchParams.append("controls", Number(showControls).toString());

        searchParams.append("dnt", "1");

        const vimeoBaseUrl = "https://player.vimeo.com/video/";
        const vimeoUrl = new URL(`${vimeoBaseUrl}${identifier ?? ""}`);
        vimeoUrl.search = searchParams.toString();

        return (
            <VideoContainer heightInPercent={getHeightInPercentForAspectRatio(aspectRatio)}>
                <iframe src={vimeoUrl.toString()} allow="autoplay" allowFullScreen style={{ border: 0 }} />
            </VideoContainer>
        );
    },
    { label: "Vimeo Video" },
);
