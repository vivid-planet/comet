import { createTextBlockRenderFn, defaultRichTextRenderers, RichTextBlock, RichTextBlockProps } from "@src/common/blocks/RichTextBlock";

const renderers = {
    ...defaultRichTextRenderers,
    blocks: {
        unstyled: createTextBlockRenderFn({ variant: "p200", style: { color: "gray" } }),
    },
};

export const InfoTextBlock = (props: RichTextBlockProps) => <RichTextBlock renderers={renderers} {...props} />;
