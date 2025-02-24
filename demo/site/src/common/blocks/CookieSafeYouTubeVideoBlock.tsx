"use client";
import { CookieSafe, useCookieApi, YouTubeVideoBlock } from "@comet/cms-site";
import { cookieIds } from "@src/util/cookieIds";
import { type ComponentProps, type CSSProperties } from "react";
import styled from "styled-components";

import { FallbackCookiePlaceholder, LoadingCookiePlaceholder } from "../helpers/CookiePlaceholders";

const aspectRatio = "16x9";

export const CookieSafeYouTubeVideoBlock = (props: ComponentProps<typeof YouTubeVideoBlock>) => {
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

const Root = styled.div<{ $aspectRatio: CSSProperties["aspectRatio"] }>`
    position: relative;
    aspect-ratio: ${({ $aspectRatio }) => $aspectRatio};
`;
