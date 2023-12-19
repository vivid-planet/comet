import { BlocksBlock, PropsWithData, SupportedBlocks, YouTubeVideoBlock } from "@comet/cms-site";
import { PageContentBlockData } from "@src/blocks.generated";
import { openCookiebotCookieSettings, useCookieBotConsent } from "@src/util/cookieBot";
import { openOneTrustCookieSettings, useOneTrustConsent } from "@src/util/oneTrust";
import * as React from "react";

import { YouTubeVideoBlockData } from "../../../../packages/site/cms-site/src/blocks.generated";
import { AnchorBlock } from "./AnchorBlock";
import { ColumnsBlock } from "./ColumnsBlock";
import { DamImageBlock } from "./DamImageBlock";
import DamVideoBlock from "./DamVideoBlock";
import { FullWidthImageBlock } from "./FullWidthImageBlock";
import { HeadlineBlock } from "./HeadlineBlock";
import { LinkListBlock } from "./LinkListBlock";
import { MediaBlock } from "./MediaBlock";
import RichTextBlock from "./RichTextBlock";
import SpaceBlock from "./SpaceBlock";
import { TextImageBlock } from "./TextImageBlock";
import { TwoListsBlock } from "./TwoListsBlock";

const supportedBlocks: SupportedBlocks = {
    space: (props) => <SpaceBlock data={props} />,
    richtext: (props) => <RichTextBlock data={props} />,
    headline: (props) => <HeadlineBlock data={props} />,
    image: (props) => <DamImageBlock data={props} />,
    textImage: (props) => <TextImageBlock data={props} />,
    damVideo: (props) => <DamVideoBlock data={props} />,
    youTubeVideo: (props) => <SiteYouTubeVideoBlock data={props} />,
    linkList: (props) => <LinkListBlock data={props} />,
    fullWidthImage: (props) => <FullWidthImageBlock data={props} />,
    columns: (props) => <ColumnsBlock data={props} />,
    anchor: (props) => <AnchorBlock data={props} />,
    media: (props) => <MediaBlock data={props} />,
    twoLists: (props) => <TwoListsBlock data={props} />,
};

export const PageContentBlock: React.FC<PropsWithData<PageContentBlockData>> = ({ data }) => {
    return <BlocksBlock data={data} supportedBlocks={supportedBlocks} />;
};

const SiteYouTubeVideoBlock = (p: PropsWithData<YouTubeVideoBlockData>) => {
    const cookieBotConsent = useCookieBotConsent();
    const cookieBotMarketingCookiesAccepted = cookieBotConsent.includes("marketing");

    const oneTrustConsent = useOneTrustConsent();
    const oneTrustMarketingCookieId = "C01"; // Defined in the OneTrust Admin UI
    const oneTrustMarketingCookiesAccepted = oneTrustConsent.includes(oneTrustMarketingCookieId);

    return (
        <>
            <h2 style={{ marginTop: 50 }}>OneTrust:</h2>
            <YouTubeVideoBlock
                {...p}
                necessaryThirdPartyCookiesHaveBeenAccepted={oneTrustMarketingCookiesAccepted}
                openCookieSettings={openOneTrustCookieSettings}
            />
            <h2 style={{ marginTop: 50 }}>CookieBot:</h2>
            <YouTubeVideoBlock
                {...p}
                necessaryThirdPartyCookiesHaveBeenAccepted={cookieBotMarketingCookiesAccepted}
                openCookieSettings={openCookiebotCookieSettings}
            />
        </>
    );
};
