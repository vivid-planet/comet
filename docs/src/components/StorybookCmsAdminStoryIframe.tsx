import BrowserOnly from "@docusaurus/BrowserOnly";

type Props = {
    storyId: string;
    height: number;
};

export const StorybookCmsAdminStoryIframe = ({ storyId, height }: Props) => {
    return <BrowserOnly>{() => <IFrame storyId={storyId} height={height} />}</BrowserOnly>;
};

const IFrame = ({ storyId, height }: Props) => {
    const url = `${getCmsAdminStorybookDomain()}/iframe.html?viewMode=story&id=${storyId}`;
    return <iframe src={url} width="100%" height={height} style={{ border: "1px solid var(--ifm-color-emphasis-300)", borderRadius: 4 }} />;
};

const cmsAdminChromaticProjectId = "69df3371c46abe69b5199825";

const getCmsAdminStorybookDomain = () => {
    if (process.env.NODE_ENV === "development") {
        return "http://localhost:26647";
    }

    return `https://${getChromaticBranch()}--${cmsAdminChromaticProjectId}.chromatic.com`;
};

const getChromaticBranch = () => {
    if (typeof window === "undefined" || !window.location.origin) {
        return "main";
    }

    const originParts = window.location.origin.split(".");
    if (!originParts.length) {
        return "main";
    }

    if (originParts[0].includes("next")) {
        return "next";
    }

    if (originParts[0].includes("deploy-preview")) {
        return originParts[0].replace(/^https?:\/\//, "");
    }

    return "main";
};
