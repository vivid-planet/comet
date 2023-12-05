import { CharacterMetadata, ContentBlock, ContentState } from "draft-js";
import type { List } from "immutable";

/*
    This is a first, very basic implementation, inspired by https://github.com/sstur/draft-js-utils/blob/master/packages/draft-js-export-html/src/stateToHTML.js.
    Images, code snippets, custom options as attributes, elements or styles are not taken into account.
*/
import getEntityRanges from "./getEntityRanges";

type CharacterMetaList = List<CharacterMetadata>;

export const INLINE_STYLE = {
    BOLD: "BOLD",
    ITALIC: "ITALIC",
    STRIKETHROUGH: "STRIKETHROUGH",
    UNDERLINE: "UNDERLINE",
};

export const ENTITY_TYPE = {
    LINK: "LINK",
};

// Order: inner-most style to outer-most.
// Examle: <em><strong>foo</strong></em>
const DEFAULT_STYLE_ORDER = [INLINE_STYLE.BOLD, INLINE_STYLE.ITALIC, INLINE_STYLE.UNDERLINE, INLINE_STYLE.STRIKETHROUGH];

const DEFAULT_STYLE_MAP = {
    [INLINE_STYLE.BOLD]: { element: "inline" },
    [INLINE_STYLE.ITALIC]: { element: "inline" },
    [INLINE_STYLE.STRIKETHROUGH]: { element: "inline" },
    [INLINE_STYLE.UNDERLINE]: { element: "inline" },
};

/* 
    escapes special characters in the text content to their HTML/XML entities
*/
function encodeContent(text: string): string {
    return text.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;").split("\xA0").join("&nbsp;").split("\n").join(`<br>\n`);
}

class MarkupGenerator {
    blocks: ContentBlock[] = [];
    contentState: ContentState | undefined;
    output: string[] = [];
    currentBlock = 0;
    indentLevel = 0;
    totalBlocks = 0;
    inlineStyles = DEFAULT_STYLE_MAP;
    styleOrder: string[] = DEFAULT_STYLE_ORDER;
    indent = "  ";
    counter = 1;

    constructor(contentState?: ContentState) {
        this.contentState = contentState;
    }

    generate(): string[] {
        if (!this.contentState) {
            return [];
        }

        this.output = [];
        this.blocks = this.contentState.getBlocksAsArray();
        this.totalBlocks = this.blocks.length;
        this.currentBlock = 0;

        while (this.currentBlock < this.totalBlocks) {
            this.processBlock(this.contentState);
        }

        return this.output.filter((content) => content !== "" && content !== "\n");
    }

    processBlock(contentState: ContentState) {
        const block = this.blocks[this.currentBlock];

        const content = this.renderBlockContent(block, contentState);

        this.output.push(content);

        this.currentBlock += 1;
        this.output.push(`\n`);
    }

    renderBlockContent(block: ContentBlock, contentState: ContentState): string {
        let text = block.getText();

        let currentLinkId = 0;

        if (text === "") {
            return "";
        }

        text = this.preserveWhitespace(text);

        // getting a list including all styles and entites for every single character
        const charMetaList: CharacterMetaList = block.getCharacterList();

        // divides the information about style and entities of each character into ranges
        const entityPieces = getEntityRanges(text, charMetaList);

        return entityPieces
            .map(([entityKey, stylePieces]) => {
                const content = stylePieces
                    .map(([text, styleSet]) => {
                        let content = encodeContent(text);
                        for (const styleName of this.styleOrder) {
                            const currentStyle = styleSet.find((style) => style.style === styleName);

                            if (currentStyle) {
                                let { element } = this.inlineStyles[styleName];
                                if (element == null) {
                                    element = "span";
                                }
                                content = `<${element} id="${currentStyle.id}">${content}</${element}>`;
                            }
                        }

                        return content;
                    })
                    .join("");

                const entity = entityKey ? contentState.getEntity(entityKey) : null;
                // Note: The `toUpperCase` below is for compatability with some libraries that use lower-case for image blocks.
                const entityType = entity == null ? null : entity.getType().toUpperCase();

                if (entityType != null && entityType === ENTITY_TYPE.LINK) {
                    currentLinkId += 1;
                    return `<entity id="${currentLinkId}">${content}</entity>`;
                } else {
                    return content;
                }
            })
            .join("");
    }

    /*
preserves leading/trailing/consecutive whitespace in the text content
*/
    preserveWhitespace(text: string): string {
        const length = text.length;
        const newText = new Array(length);
        for (let i = 0; i < length; i++) {
            if (text[i] === " " && (i === 0 || i === length - 1 || text[i - 1] === " ")) {
                newText[i] = "\xA0";
            } else {
                newText[i] = text[i];
            }
        }
        return newText.join("");
    }
}

export function transformStateToXml(content: ContentState): string[] {
    return new MarkupGenerator(content).generate();
}

export function blockToXml(contentBlock: ContentBlock, contentState: ContentState): string {
    return new MarkupGenerator().renderBlockContent(contentBlock, contentState);
}
