import { Mark, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        cmsLink: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setCmsLink: (attrs: { data: any }) => ReturnType;
            unsetCmsLink: () => ReturnType;
        };
    }
}

export const CmsLink = Mark.create({
    name: "link",
    inclusive: false,
    excludes: "",

    addAttributes() {
        return {
            data: {
                default: null,
            },
        };
    },

    parseHTML() {
        return [{ tag: "a[data-cms-link]" }];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "a",
            mergeAttributes(HTMLAttributes, {
                "data-cms-link": "",
                style: "color: inherit; text-decoration: underline; cursor: pointer;",
            }),
            0,
        ];
    },

    addCommands() {
        return {
            setCmsLink:
                (attrs) =>
                ({ commands }) =>
                    commands.setMark(this.name, attrs),
            unsetCmsLink:
                () =>
                ({ commands }) =>
                    commands.unsetMark(this.name),
        };
    },
});
