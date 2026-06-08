import { mergeAttributes, Node } from "@tiptap/core";

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
});
