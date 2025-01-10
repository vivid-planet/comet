"use client";
import { CookieSafe, useCookieApi, YouTubeVideoBlock } from "@comet/cms-site";
import { styled } from "@pigment-css/react";
import { cookieIds } from "@src/util/cookieIds";
import { createShouldForwardPropBlockList } from "@src/util/createShouldForwardPropBlockList";
import { ComponentProps } from "react";

import { FallbackCookiePlaceholder, LoadingCookiePlaceholder } from "../helpers/CookiePlaceholders";

const aspectRatio = "16x9";

export const CookieSafeYouTubeVideoBlock = (props: ComponentProps<typeof YouTubeVideoBlock>) => {
    const { consentedCookies } = useCookieApi();

    return (
        <Root aspectRatio={aspectRatio.replace("x", "/")}>
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

type RootStyleProps = {
    aspectRatio: React.CSSProperties["aspectRatio"];
};
const Root = styled("div", { shouldForwardProp: createShouldForwardPropBlockList(["aspectRatio"]) })<RootStyleProps>({
    position: "relative",
    aspectRatio: ({ aspectRatio }) => aspectRatio,
});
