import { mergeAttributes, Node } from "@tiptap/core";

export const ChildBlock = Node.create({
    name: "childBlock",
    group: "block",
    atom: true,

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
        return ["div", mergeAttributes(HTMLAttributes, { "data-child-block": "" })];
    },
});
