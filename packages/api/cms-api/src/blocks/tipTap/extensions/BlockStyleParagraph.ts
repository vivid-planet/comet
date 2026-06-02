import Paragraph from "@tiptap/extension-paragraph";

export const BlockStyleParagraph = Paragraph.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            blockStyle: {
                default: null,
            },
        };
    },
});
