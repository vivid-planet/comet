"use client";

import { createFetchInMemoryCache, useIFrameBridge } from "@comet/site-nextjs";
import { type EmailCampaignContentBlockData } from "@src/blocks.generated";
import { generateMjmlMailContent, RenderedMail } from "@src/brevo/components/RenderedMail";
import { type ContentScope } from "@src/site-configs";
import { withBlockPreview } from "@src/util/blockPreview";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import { loadMessages } from "@src/util/loadMessages";
import { recursivelyLoadBlockData } from "@src/util/recursivelyLoadBlockData";
import { useEffect, useState } from "react";
import type { IntlConfig } from "react-intl";

const cachingFetch = createFetchInMemoryCache(fetch);

export default withBlockPreview((params: unknown) => {
    console.log("params ", params);
    const language = "en";
    const iFrameBridge = useIFrameBridge();

    const [blockData, setBlockData] = useState<EmailCampaignContentBlockData>();
    const [messages, setMessages] = useState<IntlConfig["messages"]>();
    useEffect(() => {
        async function load() {
            if (!iFrameBridge.block) {
                setBlockData(undefined);
                return;
            }
            const graphQLFetch = createGraphQLFetch({ fetch: cachingFetch });
            const newData = await recursivelyLoadBlockData({
                blockType: "EmailCampaignContent",
                blockData: iFrameBridge.block,
                graphQLFetch,
                fetch: cachingFetch,
                scope: iFrameBridge.contentScope as ContentScope,
            });
            const messages = await loadMessages(language);

            setBlockData(newData);
            setMessages(messages);
        }
        load();
    }, [iFrameBridge.block, iFrameBridge.contentScope]);

    if (blockData === undefined) {
        return null;
    }
    const mjmlContent = generateMjmlMailContent(blockData, { locale: language, messages });

    return <RenderedMail mjmlContent={mjmlContent} />;
});
