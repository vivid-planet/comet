import Heading from "@tiptap/extension-heading";

export const TextBlockStyleHeading = Heading.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            textBlockStyle: {
                default: null,
            },
        };
    },
});
