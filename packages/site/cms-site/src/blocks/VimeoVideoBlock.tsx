import * as React from "react";

import { VimeoVideoBlockData } from "../blocks.generated";
import { withPreview } from "../iframebridge/withPreview";
import { PreviewSkeleton } from "../previewskeleton/PreviewSkeleton";
import { getHeightInPercentForAspectRatio, VideoContainer } from "./helpers";
import { PropsWithData } from "./PropsWithData";

const isUrl = (value: string) => {
    try {
        return Boolean(new URL(value));
    } catch (e) {
        return false;
    }
};

function parseVimeoIdentifier(vimeoIdentifier: string): string | undefined {
    const urlRegEx = /(https?:\/\/)?(www\.)?(player\.)?vimeo\.com\/?(showcase\/)*([0-9)([a-z]*\/)*([0-9]{6,11})[?]?.*/;
    const idRegEx = /([0-9]{6,11})/;

    const identifierIsUrl = isUrl(vimeoIdentifier);

    const regEx = identifierIsUrl ? urlRegEx : idRegEx;
    const match = vimeoIdentifier.match(regEx);

    if (match) {
        const idIndex = identifierIsUrl ? 6 : 1;
        return match[idIndex];
    } else {
        return undefined;
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
