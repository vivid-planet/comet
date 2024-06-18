import { CookieSafe, PropsWithData, YouTubeVideoBlock } from "@comet/cms-site";
import { YouTubeVideoBlockData } from "@src/blocks.generated";
import { CookieFallback } from "@src/components/common/CookieFallback";
import { cookieIds, useCookieApi } from "@src/util/cookies";
import styled from "styled-components";

// TODO: Consider if `CookieSafe` should be moved into `YouTubeVideoBlock` directly and expose the `consented` and `fallback` props.
// - Could be an issue if the fallback needs to be rendered outisde of the block 🤔

export const CookieSafeYouTubeVideoBlock = (props: PropsWithData<YouTubeVideoBlockData>) => {
    const { consentedCookies } = useCookieApi();

    return (
        <Root aspectRatio={props.data.aspectRatio.replace("X", "/")}>
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
