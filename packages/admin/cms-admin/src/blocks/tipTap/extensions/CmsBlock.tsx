import { Delete } from "@comet/admin-icons";
import { Box, IconButton } from "@mui/material";
import { grey as muiGreyPalette } from "@mui/material/colors";
import { mergeAttributes, Node } from "@tiptap/core";
import { NodeViewWrapper, type ReactNodeViewProps, ReactNodeViewRenderer } from "@tiptap/react";
import { useContext, useState } from "react";

import { BlockPreviewContent } from "../../common/blockRow/BlockPreviewContent";
import type { BlockState } from "../../types";
import { ChildBlocksContext } from "../ChildBlocksContext";
import { TipTapBlockDialog } from "../TipTapBlockDialog";

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        cmsBlock: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            insertCmsBlock: (attrs: { blockType: string; data: any }) => ReturnType;
        };
    }
}

const CmsBlockView = ({ node, updateAttributes, deleteNode, selected }: ReactNodeViewProps) => {
    const childBlocks = useContext(ChildBlocksContext);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const blockType = node.attrs.blockType as string;
    const block = childBlocks.find((childBlock) => childBlock.name === blockType);

    return (
        <NodeViewWrapper>
            <Box
                contentEditable={false}
                sx={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    p: "8px 12px",
                    my: "8px",
                    border: `1px solid ${selected ? muiGreyPalette[600] : muiGreyPalette[300]}`,
                    borderRadius: "4px",
                    backgroundColor: muiGreyPalette[50],
                    cursor: "pointer",
                    "&:hover": { borderColor: muiGreyPalette[500] },
                }}
                onClick={() => {
                    if (block) {
                        setEditDialogOpen(true);
                    }
                }}
            >
                <Box sx={{ flexGrow: 1, overflow: "hidden", pointerEvents: "none" }}>
                    {block ? <BlockPreviewContent block={block} state={node.attrs.data} showIcon /> : blockType}
                </Box>
                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteNode();
                    }}
                >
                    <Delete />
                </IconButton>
            </Box>
            {editDialogOpen && block && (
                <TipTapBlockDialog
                    block={block}
                    initialState={node.attrs.data as BlockState<typeof block>}
                    isEditing
                    onSubmit={(data) => updateAttributes({ data })}
                    onRemove={deleteNode}
                    onClose={() => setEditDialogOpen(false)}
                />
            )}
        </NodeViewWrapper>
    );
};

export const CmsBlock = Node.create({
    name: "cmsBlock",
    group: "block",
    atom: true,
    selectable: true,
    draggable: true,

    addAttributes() {
        return {
            blockType: {
                default: null,
            },
            data: {
                default: null,
            },
        };
    },

    parseHTML() {
        return [{ tag: "div[data-cms-block]" }];
    },

    renderHTML({ HTMLAttributes }) {
        return ["div", mergeAttributes(HTMLAttributes, { "data-cms-block": "" })];
    },

    addNodeView() {
        return ReactNodeViewRenderer(CmsBlockView);
    },

    addCommands() {
        return {
            insertCmsBlock:
                (attrs) =>
                ({ commands }) =>
                    commands.insertContent({ type: this.name, attrs }),
        };
    },
});
