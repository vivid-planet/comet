"use client";
import { CookieSafe, PropsWithData, useCookieApi, YouTubeVideoBlock } from "@comet/cms-site";
import { YouTubeVideoBlockData } from "@src/blocks.generated";
import { CookiePlaceholder } from "@src/components/common/CookiePlaceholders";
import { cookieIds } from "@src/util/cookieIds";
import styled from "styled-components";

const aspectRatio = "16x9";

export const CookieSafeYouTubeVideoBlock = (props: PropsWithData<YouTubeVideoBlockData>) => {
    const { consentedCookies } = useCookieApi();

    return (
        <Root $aspectRatio={aspectRatio.replace("x", "/")}>
            <CookieSafe
                consented={consentedCookies.includes(cookieIds.thirdParty)}
                fallback={<CookiePlaceholder variant="fallback" />}
                loading={<CookiePlaceholder variant="loading" />}
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
