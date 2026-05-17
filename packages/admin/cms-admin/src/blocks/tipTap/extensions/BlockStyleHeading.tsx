import Heading from "@tiptap/extension-heading";
import { NodeViewContent, NodeViewWrapper, type ReactNodeViewProps, ReactNodeViewRenderer } from "@tiptap/react";
import { useContext } from "react";

import { BlockStyleContext } from "../BlockStyleContext";

function BlockStyleHeadingView({ node }: ReactNodeViewProps) {
    const blockStyles = useContext(BlockStyleContext);
    const styleName = node.attrs.blockStyle as string | null;
    const config = styleName ? blockStyles.find((s) => s.name === styleName) : undefined;
    const tag = `h${node.attrs.level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

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
        <NodeViewWrapper as={tag}>
            <NodeViewContent />
        </NodeViewWrapper>
    );
}

export const BlockStyleHeading = Heading.extend({
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
        return ReactNodeViewRenderer(BlockStyleHeadingView);
    },
});
