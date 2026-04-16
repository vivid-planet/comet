import Paragraph from "@tiptap/extension-paragraph";
import { NodeViewContent, NodeViewWrapper, type ReactNodeViewProps, ReactNodeViewRenderer } from "@tiptap/react";
import { type ComponentType, type HTMLAttributes, useContext } from "react";

import { BlockStyleContext } from "../BlockStyleContext";

// NodeViewWrapper spreads all its props (including `as`, `style`) onto the rendered
// element via the `as` prop. We strip `as` and `style` so TipTap's internal
// whiteSpace style doesn't overwrite the block style element's own styles.
function createNodeViewElement(Element: ComponentType<HTMLAttributes<HTMLElement>>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ({ as: _as, style: _style, ...props }: any) => <Element {...props} />;
}

function BlockStyleParagraphView({ node }: ReactNodeViewProps) {
    const blockStyles = useContext(BlockStyleContext);
    const styleName = node.attrs.blockStyle as string | null;
    const config = styleName ? blockStyles.find((s) => s.name === styleName) : undefined;

    if (config) {
        const Wrapper = createNodeViewElement(config.element);
        return (
            <NodeViewWrapper as={Wrapper} data-block-style={styleName}>
                <NodeViewContent />
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
        // contentDOMElementTag is a valid runtime option but missing from TipTap's type definitions
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return ReactNodeViewRenderer(BlockStyleParagraphView, { contentDOMElementTag: "span" } as any);
    },
});
