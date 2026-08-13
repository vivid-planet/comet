import { MjmlColumn, MjmlSection, MjmlText, type MjmlTextProps, type PropsWithData } from "@dextinity/mail-react";
import { ExternalLinkBlock } from "@dextinity/site-nextjs";
import type { ExternalLinkBlockData, RichTextBlockData } from "@src/blocks.generated";
import { type FC, isValidElement } from "react";
import redraft, { type Renderers, type TextBlockRenderFn } from "redraft";

function createTextBlockRenderFn(props: MjmlTextProps): TextBlockRenderFn {
    return (children, { keys }) =>
        children.map((child, index) => (
            <MjmlText key={keys[index]} bottomSpacing {...props}>
                {child}
            </MjmlText>
        ));
}

const defaultRichTextRenderers: Renderers = {
    inline: {
        BOLD: (children, { key }) => <b key={key}>{children}</b>,
        ITALIC: (children, { key }) => <i key={key}>{children}</i>,
    },
    blocks: {
        unstyled: createTextBlockRenderFn({ variant: "copy" }),
        "header-one": createTextBlockRenderFn({ variant: "title" }),
        "header-two": createTextBlockRenderFn({ variant: "header" }),
        "header-three": createTextBlockRenderFn({ variant: "header" }),
        "header-four": createTextBlockRenderFn({ variant: "header" }),
        "header-five": createTextBlockRenderFn({ variant: "header" }),
        "header-six": createTextBlockRenderFn({ variant: "header" }),
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

export const MailRichTextBlock: FC<PropsWithData<RichTextBlockData>> = ({ data }) => {
    const rendered = redraft(data.draftContent, defaultRichTextRenderers);

    return (
        <MjmlSection indent>
            <MjmlColumn>{rendered}</MjmlColumn>
        </MjmlSection>
    );
};
