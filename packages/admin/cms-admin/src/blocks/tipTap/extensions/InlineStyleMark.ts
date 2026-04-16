import { Mark, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        inlineStyle: {
            setInlineStyle: (attrs: { type: string }) => ReturnType;
            unsetInlineStyle: () => ReturnType;
        };
    }
}

export const InlineStyleMark = Mark.create({
    name: "inlineStyle",
    excludes: "",

    addAttributes() {
        return {
            type: {
                default: null,
                parseHTML: (element: HTMLElement) => element.getAttribute("data-inline-style"),
                renderHTML: (attributes: { type: string | null }) => {
                    if (!attributes.type) {
                        return {};
                    }
                    return { "data-inline-style": attributes.type };
                },
            },
        };
    },

    parseHTML() {
        return [{ tag: "span[data-inline-style]" }];
    },

    renderHTML({ HTMLAttributes }) {
        return ["span", mergeAttributes(HTMLAttributes), 0];
    },

    addCommands() {
        return {
            setInlineStyle:
                (attrs) =>
                ({ commands }) =>
                    commands.setMark(this.name, attrs),
            unsetInlineStyle:
                () =>
                ({ commands }) =>
                    commands.unsetMark(this.name),
        };
    },
});
