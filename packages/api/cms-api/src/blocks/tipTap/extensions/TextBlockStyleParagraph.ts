import Paragraph from "@tiptap/extension-paragraph";

export const TextBlockStyleParagraph = Paragraph.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            textBlockStyle: {
                default: null,
            },
        };
    },
});
