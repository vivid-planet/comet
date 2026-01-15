import { type PropsWithData } from "@comet/mail-react";
import { ExternalLinkBlock } from "@comet/site-nextjs";
import { MjmlColumn } from "@faire/mjml-react";
import { type ExternalLinkBlockData, type RichTextBlockData } from "@src/blocks.generated";
import { IndentedSectionGroup } from "@src/brevo/components/IndentedSectionGroup";
import { Typography, type TypographyProps } from "@src/brevo/components/Typography";
import { type FC, isValidElement } from "react";
import redraft, { type Renderers, type TextBlockRenderFn } from "redraft";

function createTextBlockRenderFn(props: TypographyProps): TextBlockRenderFn {
    return (children, { keys }) =>
        children.map((child, index) => (
            <Typography key={keys[index]} {...props}>
                {child}
            </Typography>
        ));
}

export const defaultRichTextRenderers: Renderers = {
    inline: {
        BOLD: (children, { key }) => <b key={key}>{children}</b>,
        ITALIC: (children, { key }) => <i key={key}>{children}</i>,
    },
    blocks: {
        unstyled: createTextBlockRenderFn({ variant: "body" }),
        "header-one": createTextBlockRenderFn({ variant: "headline", fontSize: 26 }),
        "header-two": createTextBlockRenderFn({ variant: "headline", fontSize: 24 }),
        "header-three": createTextBlockRenderFn({ variant: "headline", fontSize: 22 }),
        "header-four": createTextBlockRenderFn({ variant: "headline", fontSize: 20 }),
        "header-five": createTextBlockRenderFn({ variant: "headline", fontSize: 18 }),
        "header-six": createTextBlockRenderFn({ variant: "headline", fontSize: 16, fontWeight: "600" }),
    },
    /**
     * Entities receive children and the entity data
     */
    entities: {
        // key is the entity key value from raw
        LINK: (children, data: ExternalLinkBlockData, { key }) =>
            data.targetUrl && isValidElement(children) ? (
                <ExternalLinkBlock key={key} data={data}>
                    {children}
                </ExternalLinkBlock>
            ) : (
                <span key={key}>{children}</span>
            ),
    },
};

export const EmailCampaignRichTextBlock: FC<PropsWithData<RichTextBlockData>> = ({ data }) => {
    const rendered = redraft(data.draftContent, defaultRichTextRenderers);

    return (
        <IndentedSectionGroup>
            <MjmlColumn>{rendered}</MjmlColumn>
        </IndentedSectionGroup>
    );
};
