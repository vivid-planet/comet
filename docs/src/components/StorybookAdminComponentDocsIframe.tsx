import BrowserOnly from "@docusaurus/BrowserOnly";
import { styled } from "@mui/material/styles";
import { kebabCase, pascalCase } from "change-case";
import { useEffect, useRef, useState } from "react";

type Props = {
    storyId: string;
};

/**
 * @deprecated Will be removed shorty.
 */
export const StorybookAdminComponentDocsIframe = ({ storyId }: Props) => {
    return <BrowserOnly>{() => <DocsPageIFrame storyId={storyId} />}</BrowserOnly>;
};

type StoryIframeProps = {
    componentName: string;
    storyName: string;
};

export const StoryIframe = (props: StoryIframeProps) => {
    return <BrowserOnly>{() => <ClientStoryIframe {...props} />}</BrowserOnly>;
};

type PrimaryStoryIframeProps = {
    componentName: string;
};

export const PrimaryStoryIframe = (props: PrimaryStoryIframeProps) => {
    return <BrowserOnly>{() => <ClientPrimaryStoryIframe {...props} />}</BrowserOnly>;
};

const StoryIframeRoot = styled("div")`
    box-shadow: 0 1px 5px 2px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    padding: 10px;
    background-color: #fff;
`;

const StoryCode = ({ componentName, storyName }: StoryIframeProps) => {
    const [StoryCodeComponent, setStoryCodeComponent] = useState<React.ComponentType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStoryCode = async () => {
            try {
                // Import the generated React component directly
                const module = await import(`../../docs/5-admin-components/components/stories-code/${pascalCase(componentName)}.${storyName}.tsx`);
                setStoryCodeComponent(() => module.default);
            } catch {
                console.warn(`Story code component not found: ${componentName}.${storyName}.tsx`);
                setStoryCodeComponent(null);
            } finally {
                setLoading(false);
            }
        };

        loadStoryCode();
    }, [componentName, storyName]);

    if (loading) {
        return <div>Loading story code...</div>;
    }

    if (!StoryCodeComponent) {
        return <div>Story code not available</div>;
    }

    return <StoryCodeComponent />;
};

const ClientStoryIframe = ({ componentName, storyName }: StoryIframeProps) => {
    const { iframeContentHeight, iframeRef } = useIframeContentHeight(200);
    const [showCode, setShowCode] = useState(false);

    const storybookDocsUrl = new URL(`${getStorybookDomain()}/iframe.html`);
    storybookDocsUrl.searchParams.set("id", `component-docs-${componentName}--${kebabCase(storyName)}`);
    storybookDocsUrl.searchParams.set("viewMode", "story");

    return (
        <>
            <StoryIframeRoot>
                <iframe src={storybookDocsUrl.toString()} width="100%" height={iframeContentHeight} ref={iframeRef} />
            </StoryIframeRoot>
            <button onClick={() => setShowCode(!showCode)}>{showCode ? "Hide Code" : "Show Code"}</button>
            {showCode && <StoryCode componentName={componentName} storyName={storyName} />}
        </>
    );
};

const ClientPrimaryStoryIframe = ({ componentName }: PrimaryStoryIframeProps) => {
    const { iframeContentHeight, iframeRef } = useIframeContentHeight(800);

    const storybookDocsUrl = new URL(`${getStorybookDomain()}/iframe.html`);
    storybookDocsUrl.searchParams.set("id", `component-docs-${componentName}--docs`);
    storybookDocsUrl.searchParams.set("viewMode", "docs");
    storybookDocsUrl.searchParams.set("isEmbeddedInDocs", "true");

    return <iframe src={storybookDocsUrl.toString()} width="100%" height={iframeContentHeight} ref={iframeRef} />;
};

const DocsPageIFrame = ({ storyId }: Props) => {
    const storybookDomain = getStorybookDomain();
    const storybookDocsUrl = `${storybookDomain}/iframe.html?viewMode=docs&id=${storyId}&isEmbeddedInDocs=true`;
    const { iframeContentHeight, iframeRef } = useIframeContentHeight(800);

    return <iframe src={storybookDocsUrl} width="100%" height={iframeContentHeight} ref={iframeRef} />;
};

const useIframeContentHeight = (fallbackIframeHeight: number) => {
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
