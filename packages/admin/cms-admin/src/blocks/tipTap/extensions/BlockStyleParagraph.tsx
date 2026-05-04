import Paragraph from "@tiptap/extension-paragraph";
import { NodeViewContent, NodeViewWrapper, type ReactNodeViewProps, ReactNodeViewRenderer } from "@tiptap/react";
import { useContext } from "react";

import { BlockStyleContext } from "../BlockStyleContext";

function BlockStyleParagraphView({ node }: ReactNodeViewProps) {
    const blockStyles = useContext(BlockStyleContext);
    const styleName = node.attrs.blockStyle as string | null;
    const config = styleName ? blockStyles.find((s) => s.name === styleName) : undefined;

    if (config) {
        const Element = config.element;
        return (
            <NodeViewWrapper>
                <Element data-block-style={styleName}>
                    <NodeViewContent />
                </Element>
            </NodeViewWrapper>
        );
    }

    return (
        <NodeViewWrapper as="p">
            <NodeViewContent />
        </NodeViewWrapper>
    );
}

export const BlockStyleParagraph = Paragraph.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            blockStyle: {
                default: null,
                parseHTML: (element: HTMLElement) => element.getAttribute("data-block-style"),
                renderHTML: (attributes: { blockStyle: string | null }) => {
                    if (!attributes.blockStyle) {
                        return {};
                    }
                    return { "data-block-style": attributes.blockStyle };
                },
            },
        };
    },

    addNodeView() {
        return ReactNodeViewRenderer(BlockStyleParagraphView);
    },
});
