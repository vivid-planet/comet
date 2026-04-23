import { greyPalette } from "@comet/admin";
import { Delete, Edit } from "@comet/admin-icons";
import { mergeAttributes, Node } from "@tiptap/core";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { NodeViewWrapper, ReactNodeViewRenderer, type ReactNodeViewRendererOptions } from "@tiptap/react";
import { useContext } from "react";
import { FormattedMessage } from "react-intl";

import { ChildBlockContext } from "../ChildBlockContext";

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        childBlock: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            insertChildBlock: (attrs: { type: string; data: any }) => ReturnType;
        };
    }
}

function ChildBlockView({ node, getPos }: { node: ProseMirrorNode; getPos: () => number | undefined }) {
    const { childBlocks, onEditChildBlock, onDeleteChildBlock } = useContext(ChildBlockContext);
    const blockType = node.attrs.type as string;
    const block = childBlocks.find((b) => b.name === blockType);

    if (!block) {
        return (
            <NodeViewWrapper>
                <div>
                    <FormattedMessage
                        id="comet.blocks.tipTapRichText.childBlock.unknownType"
                        defaultMessage="Unknown block type: {blockType}"
                        values={{ blockType }}
                    />
                </div>
            </NodeViewWrapper>
        );
    }

    const handleClick = () => {
        const pos = getPos();
        if (pos !== undefined) {
            onEditChildBlock(pos);
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        const pos = getPos();
        if (pos !== undefined) {
            onDeleteChildBlock(pos);
        }
    };

    return (
        <NodeViewWrapper contentEditable={false} data-child-block="">
            <div
                onClick={handleClick}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    border: `1px solid ${greyPalette[200]}`,
                    borderRadius: 4,
                    backgroundColor: greyPalette[50],
                    cursor: "pointer",
                    userSelect: "none",
                    margin: "4px 0",
                }}
            >
                <div
                    style={{
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    <span style={{ fontWeight: 500, color: greyPalette[800], fontSize: 13 }}>{block.displayName}</span>
                </div>
                <button
                    type="button"
                    onClick={handleClick}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 4,
                        color: greyPalette[600],
                    }}
                >
                    <Edit style={{ fontSize: 16 }} />
                </button>
                <button
                    type="button"
                    onClick={handleDelete}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 4,
                        color: greyPalette[600],
                    }}
                >
                    <Delete style={{ fontSize: 16 }} />
                </button>
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
