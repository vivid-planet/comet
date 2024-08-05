"use client";
import { CookieSafe, PropsWithData, useCookieApi, YouTubeVideoBlock } from "@comet/cms-site";
import { YouTubeVideoBlockData } from "@src/blocks.generated";
import { CookieFallback } from "@src/components/common/CookieFallback";
import { cookieIds } from "@src/util/cookieIds";
import styled from "styled-components";

export const CookieSafeYouTubeVideoBlock = (props: PropsWithData<YouTubeVideoBlockData>) => {
    const { consentedCookies } = useCookieApi();

    return (
        // TODO: fix this (was `props.data.aspectRatio.replace("X", "/")` but `aspectRatio` prop has been removed)
        <Root aspectRatio="16/9">
            <CookieSafe consented={consentedCookies.includes(cookieIds.thirdParty)} fallback={<CookieFallback />}>
                <YouTubeVideoBlock {...props} />
            </CookieSafe>
        </Root>
    );
};

const Root = styled.div<{ aspectRatio: React.CSSProperties["aspectRatio"] }>`
    position: relative;
    aspect-ratio: ${({ aspectRatio }) => aspectRatio};
`;
