"use client";

import type { Config } from "@comet/mail-react";
import { createFetchInMemoryCache, useIFrameBridge } from "@comet/site-nextjs";
import type { WelcomeEmailContentBlockData } from "@src/blocks.generated";
import type { ContentScope } from "@src/site-configs";
import { withBlockPreview } from "@src/util/blockPreview";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import { recursivelyLoadBlockData } from "@src/util/recursivelyLoadBlockData";
import { RenderedWelcomeEmail } from "@src/welcomeEmail/components/RenderedWelcomeEmail";
import { renderWelcomeEmailAsMjml } from "@src/welcomeEmail/util/renderWelcomeEmailAsMjml";
import { useEffect, useState } from "react";
import type { IntlConfig } from "react-intl";

const cachingFetch = createFetchInMemoryCache(fetch);

function isContentScope(value: unknown): value is ContentScope {
    return typeof value === "object" && value !== null && "domain" in value && "language" in value;
}

interface WelcomeEmailPreviewProps {
    language: string;
    messages: IntlConfig["messages"];
    config: Config;
}

function WelcomeEmailPreviewComponent({ language, messages, config }: WelcomeEmailPreviewProps) {
    const iFrameBridge = useIFrameBridge();
    const [blockData, setBlockData] = useState<WelcomeEmailContentBlockData>();

    const scope = isContentScope(iFrameBridge.contentScope) ? iFrameBridge.contentScope : undefined;

    useEffect(() => {
        async function load() {
            if (!iFrameBridge.block || !scope) {
                setBlockData(undefined);
                return;
            }
            const graphQLFetch = createGraphQLFetch({ fetch: cachingFetch });
            const newData = await recursivelyLoadBlockData({
                blockType: "WelcomeEmailContent",
                blockData: iFrameBridge.block,
                graphQLFetch,
                fetch: cachingFetch,
                scope,
            });
            setBlockData(newData);
        }
        load();
    }, [iFrameBridge.block, scope]);

    if (blockData === undefined || scope === undefined) {
        return null;
    }

    const mjmlContent = renderWelcomeEmailAsMjml(blockData, { locale: language, messages }, config);

    return <RenderedWelcomeEmail mjmlContent={mjmlContent} />;
}

export const WelcomeEmailPreview = withBlockPreview(WelcomeEmailPreviewComponent);
