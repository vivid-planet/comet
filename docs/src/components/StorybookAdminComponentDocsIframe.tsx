import BrowserOnly from "@docusaurus/BrowserOnly";

type Props = {
    title: string;
};

const iframeContentHeight = 800; // TODO: Make this dynamic depending on iframe content

export const StorybookAdminComponentDocsIframe = ({ title }: Props) => {
    return <BrowserOnly>{() => <IFrame title={title} />}</BrowserOnly>;
};

const IFrame = ({ title }: Props) => {
    const pathName = title.toLowerCase();
    const storybookDomain = getStorybookDomain();
    const storybookDocsUrl = `${storybookDomain}/iframe.html?viewMode=docs&id=component-docs-${pathName}--docs`;

    return <iframe src={storybookDocsUrl} width="100%" height={iframeContentHeight} />;
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
