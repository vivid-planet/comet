"use client";
import { CookieSafe, PropsWithData, useCookieApi, YouTubeVideoBlock } from "@comet/site-nextjs";
import { YouTubeVideoBlockData } from "@src/blocks.generated";
import { cookieIds } from "@src/util/cookieIds";
import styled from "styled-components";

import { FallbackCookiePlaceholder, LoadingCookiePlaceholder } from "../helpers/CookiePlaceholders";

const aspectRatio = "16x9";

export const CookieSafeYouTubeVideoBlock = (props: PropsWithData<YouTubeVideoBlockData>) => {
    const { consentedCookies } = useCookieApi();

    return (
        <Root $aspectRatio={aspectRatio.replace("x", "/")}>
            <CookieSafe
                consented={consentedCookies.includes(cookieIds.thirdParty)}
                fallback={<FallbackCookiePlaceholder />}
                loading={<LoadingCookiePlaceholder />}
            >
                <YouTubeVideoBlock aspectRatio={aspectRatio} {...props} />
            </CookieSafe>
        </Root>
    );
};

const Root = styled.div<{ $aspectRatio: React.CSSProperties["aspectRatio"] }>`
    position: relative;
    aspect-ratio: ${({ $aspectRatio }) => $aspectRatio};
`;
