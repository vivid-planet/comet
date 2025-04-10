import BrowserOnly from "@docusaurus/BrowserOnly";
import CodeBlock from "@theme/CodeBlock";
import IconExternalLink from "@theme/Icon/ExternalLink";
import { pascalCase } from "change-case";
import React, { useEffect, useMemo, useRef, useState } from "react";

type AdminComponentStoryProps = {
    componentName: string;
    storyName: string;
};

const getStoryCode = (componentName: string, storyName: string) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const storyModule = require(`../generated/${pascalCase(componentName)}_${pascalCase(storyName)}.storyCode.ts`);
    return storyModule.default;
};

export const AdminComponentStory = (props: AdminComponentStoryProps) => {
    const storyCode = getStoryCode(props.componentName, props.storyName);
    return <BrowserOnly>{() => <BrowserOnlyStory {...props} storyCode={storyCode} />}</BrowserOnly>;
};

type BrowserOnlyStoryProps = AdminComponentStoryProps & {
    storyCode: string;
};

const BrowserOnlyStory = ({ componentName, storyName, storyCode }: BrowserOnlyStoryProps) => {
    const storybookDomain = getStorybookDomain();
    const { iframeContentHeight, iframeRef } = useIframeContentHeight();

    const embedUrl = useMemo(() => {
        const url = new URL(`${storybookDomain}/iframe.html`);
        url.searchParams.set("globals", "");
        url.searchParams.set("id", `component-docs-${componentName}--${storyName}`);
        url.searchParams.set("viewMode", "story");
        return url.toString();
    }, [componentName, storyName, storybookDomain]);

    const storyUrl = useMemo(() => {
        return `${storybookDomain}/?path=/story/component-docs-${componentName}--${storyName}`;
    }, [componentName, storyName, storybookDomain]);

    return (
        <>
            <iframe ref={iframeRef} src={embedUrl} width="100%" height={iframeContentHeight} />
            <details>
                <summary style={{ position: "relative" }}>
                    Code
                    <a href={storyUrl} target="_blank" rel="noreferrer" style={{ position: "absolute", right: 0 }}>
                        View Story
                        <IconExternalLink />
                    </a>
                </summary>
                <CodeBlock language="tsx">{storyCode}</CodeBlock>
            </details>
        </>
    );
};

const getStorybookDomain = () => {
    if (process.env.NODE_ENV === "development") {
        return "http://localhost:26638";
    }

    if (window.location.origin) {
        const originParts = window.location.origin.split(".");

        if (originParts.length) {
            if (originParts[0].includes("next")) {
                return `https://next--comet-admin.netlify.app`;
            }

            if (originParts[0].includes("deploy-preview")) {
                return `${originParts[0]}--comet-admin.netlify.app`;
            }
        }
    }

    return "https://storybook.comet-dxp.com";
};

const useIframeContentHeight = () => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [iframeContentHeight, setIframeContentHeight] = useState(120);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (iframeRef.current && event.source === iframeRef.current.contentWindow) {
                if (event.data && typeof event.data === "object" && event.data.type === "document-height" && typeof event.data.height === "number") {
                    setIframeContentHeight(event.data.height);
                }
            }
        };

        window.addEventListener("message", handleMessage);

        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, []);

    return { iframeContentHeight, iframeRef };
};
