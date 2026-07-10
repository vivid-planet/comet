import Paragraph from "@tiptap/extension-paragraph";

export const TextBlockStyleParagraph: typeof Paragraph = Paragraph.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            textBlockStyle: {
                default: null,
            },
        };
    },
});
