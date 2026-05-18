import Heading from "@tiptap/extension-heading";

export const BlockStyleHeading = Heading.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            blockStyle: {
                default: null,
            },
        };
    },
});
