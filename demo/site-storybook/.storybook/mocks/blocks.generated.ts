export type RichTextBlockData = {
    draftContent: any;
};

export type SpaceBlockData = {
    spacing: string;
};

export type HeadingBlockData = {
    eyebrow: RichTextBlockData;
    headline: RichTextBlockData;
    htmlTag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

export type LinkBlockData = {
    block: { type: string; props: any } | undefined;
};

export type DamImageBlockData = {
    block: { type: string; props: any } | undefined;
};

export type PixelImageBlockData = {
    damFile: any;
    cropArea: any;
    urlTemplate: string;
};

export type SvgImageBlockData = {
    damFile: any;
    damFileId: string;
};

export type CallToActionBlockData = {
    textLink: { text: string; link: LinkBlockData };
    variant: "contained" | "outlined" | "text";
};

export type CallToActionListBlockData = {
    blocks: Array<{ key: string; props: CallToActionBlockData; visible: boolean }>;
};

export type AccordionContentBlockData = {
    blocks: Array<{ key: string; type: string; visible: boolean; props: unknown }>;
};

export type AccordionItemBlockData = {
    title: string;
    content: AccordionContentBlockData;
    titleHtmlTag: keyof HTMLElementTagNameMap;
    openByDefault: boolean;
};

export type AccordionBlockData = {
    blocks: Array<{ key: string; props: AccordionItemBlockData }>;
};

export type TextImageBlockData = {
    text: RichTextBlockData;
    image: DamImageBlockData;
    imageAspectRatio: string;
    imagePosition: "left" | "right";
};

export type LayoutBlockData = {
    layout: "layout1" | "layout2" | "layout3" | "layout4" | "layout5" | "layout6" | "layout7";
    media1: DamImageBlockData;
    text1: RichTextBlockData;
    media2: DamImageBlockData;
    text2: RichTextBlockData;
};

export type InternalLinkBlockData = {
    targetPage: any;
    targetPageAnchor: string;
};

export type ExternalLinkBlockData = {
    targetUrl: string;
    openInNewWindow: boolean;
};

export type DamFileDownloadLinkBlockData = {
    file: any;
};

export type EmailLinkBlockData = {
    email: string;
};

export type PhoneLinkBlockData = {
    phone: string;
};

export type NewsLinkBlockData = {
    news: { id: string; slug: string; scope: { domain: string; language: string } } | undefined;
};

export type StandaloneHeadingBlockData = {
    heading: HeadingBlockData;
    textAlignment: "left" | "center";
};

export type StandaloneCallToActionListBlockData = {
    callToActionList: CallToActionListBlockData;
    alignment: "left" | "center" | "right";
};

export type StandaloneRichTextBlockData = RichTextBlockData;

export type StandaloneMediaBlockData = DamImageBlockData;

export type MediaBlockData = {
    block: { type: string; props: any } | undefined;
};

export type MediaGalleryBlockData = {
    blocks: Array<{ key: string; props: DamImageBlockData; visible: boolean }>;
};

export type AnchorBlockData = {
    name: string;
};

export type NewsContentBlockData = {
    blocks: Array<{ key: string; type: string; visible: boolean; props: unknown }>;
};

export type NewsListBlockData = {
    limit: number;
};

export type PageTreeIndexBlockData = {
    type: string;
};

export type NewsletterImageBlockData = DamImageBlockData;

export type EmailCampaignContentBlockData = {
    blocks: Array<{ key: string; type: string; visible: boolean; props: unknown }>;
};

export type TableBlockData = {
    blocks: Array<{ key: string; type: string; visible: boolean; props: unknown }>;
};
