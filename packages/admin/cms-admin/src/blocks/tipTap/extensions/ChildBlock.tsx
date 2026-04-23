import { greyPalette } from "@comet/admin";
import { mergeAttributes, Node } from "@tiptap/core";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { NodeViewWrapper, ReactNodeViewRenderer, type ReactNodeViewRendererOptions } from "@tiptap/react";

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        childBlock: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            insertChildBlock: (attrs: { type: string; data: any }) => ReturnType;
        };
    }
}

function ChildBlockView({ node }: { node: ProseMirrorNode }) {
    const blockType = node.attrs.type as string;

    return (
        <NodeViewWrapper contentEditable={false} data-child-block="">
            <div
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "4px 10px",
                    border: `1px solid ${greyPalette[200]}`,
                    borderRadius: 4,
                    backgroundColor: greyPalette[50],
                    userSelect: "none",
                    margin: "4px 0",
                    fontSize: 13,
                    color: greyPalette[800],
                }}
            >
                {blockType}
            </div>
        </NodeViewWrapper>
    );
}

export const ChildBlock = Node.create({
    name: "childBlock",
    group: "block",
    atom: true,
    draggable: true,
    selectable: true,

    addAttributes() {
        return {
            type: {
                default: null,
            },
            data: {
                default: null,
            },
        };
    },

    parseHTML() {
        return [{ tag: "div[data-child-block]" }];
    },

    renderHTML({ HTMLAttributes }) {
        return ["div", mergeAttributes(HTMLAttributes, { "data-child-block": "" }), 0];
    },

    addNodeView() {
        return ReactNodeViewRenderer(
            ChildBlockView as Parameters<typeof ReactNodeViewRenderer>[0],
            {
                contentDOMElementTag: undefined,
            } as Partial<ReactNodeViewRendererOptions>,
        );
    },

    addCommands() {
        return {
            insertChildBlock:
                (attrs) =>
                ({ commands }) =>
                    commands.insertContent({ type: this.name, attrs }),
        };
    },
});
