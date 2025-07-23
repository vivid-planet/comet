import BrowserOnly from "@docusaurus/BrowserOnly";
import { useEffect, useRef, useState } from "react";

type Props = {
    title: string;
};

const fallbackIframeHeight = 800;

export const StorybookAdminComponentDocsIframe = ({ title }: Props) => {
    return <BrowserOnly>{() => <IFrame title={title} />}</BrowserOnly>;
};

const IFrame = ({ title }: Props) => {
    const pathName = title.toLowerCase();
    const storybookDomain = getStorybookDomain();
    const storybookDocsUrl = `${storybookDomain}/iframe.html?viewMode=docs&id=component-docs-${pathName}--docs&isEmbeddedInDocs=true`;
    const { iframeContentHeight, iframeRef } = useIframeContentHeight();

    return <iframe src={storybookDocsUrl} width="100%" height={iframeContentHeight} ref={iframeRef} />;
};

const useIframeContentHeight = () => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [iframeContentHeight, setIframeContentHeight] = useState<number>(fallbackIframeHeight);

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

const getStorybookDomain = () => {
    if (process.env.NODE_ENV === "development") {
        return "http://localhost:26638";
    }

    if (window.location.origin) {
        const originParts = window.location.origin.split(".");

        if (originParts.length) {
            if (originParts[0].includes("next")) {
                return `https://next.storybook.comet-dxp.com`;
            }

            if (originParts[0].includes("deploy-preview")) {
                return `${originParts[0]}.storybook.comet-dxp.com`;
            }
        }
    }

    return "https://storybook.comet-dxp.com";
};
