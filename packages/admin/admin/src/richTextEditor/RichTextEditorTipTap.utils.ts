import { Extension } from "@tiptap/react";

/**
 * FontSize - Custom Extension
 * editor.commands.setFontSize(e.target.value) :set the font-size.
 */

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        fontSize: {
            /**
             * Set the font size
             */
            setFontSize: (size: string) => ReturnType;
            /**
             * Unset the font size
             */
            unsetFontSize: () => ReturnType;
        };
    }
}

export const FontSize = Extension.create({
    name: "fontSize",
    addOptions() {
        return {
            types: ["textStyle"],
        };
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: (element) => element.style.fontSize.replace(/['"]+/g, ""),
                        renderHTML: (attributes) => {
                            if (!attributes.fontSize) {
                                return {};
                            }
                            return {
                                style: `font-size: ${attributes.fontSize}`,
                            };
                        },
                    },
                },
            },
        ];
    },
    addCommands() {
        return {
            setFontSize:
                (fontSize) =>
                ({ chain }) => {
                    return chain()
                        .setMark("textStyle", { fontSize: `${fontSize}px` })
                        .run();
                },
            unsetFontSize:
                () =>
                ({ chain }) => {
                    return chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run();
                },
        };
    },
});
