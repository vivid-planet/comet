import Heading from "@tiptap/extension-heading";

export const TextBlockStyleHeading: typeof Heading = Heading.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            textBlockStyle: {
                default: null,
            },
        };
    },
});
