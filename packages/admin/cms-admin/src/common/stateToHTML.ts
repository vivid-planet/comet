import { CharacterMetadata, ContentBlock, ContentState } from "draft-js";
import type { List } from "immutable";

/*
    This is a first, very basic implementation.
    Images, code snippets, custom options as attributes, elements or styles are not taken into account.

*/
import getEntityRanges from "./getEntityRanges";

type CharacterMetaList = List<CharacterMetadata>;

export const BLOCK_TYPE = {
    UNSTYLED: "unstyled",
    HEADER_ONE: "header-one",
    HEADER_TWO: "header-two",
    HEADER_THREE: "header-three",
    HEADER_FOUR: "header-four",
    HEADER_FIVE: "header-five",
    HEADER_SIX: "header-six",
    UNORDERED_LIST_ITEM: "unordered-list-item",
    ORDERED_LIST_ITEM: "ordered-list-item",
    BLOCKQUOTE: "blockquote",
    PULLQUOTE: "pullquote",
};

export const INLINE_STYLE = {
    BOLD: "BOLD",
    CODE: "CODE",
    ITALIC: "ITALIC",
    STRIKETHROUGH: "STRIKETHROUGH",
    UNDERLINE: "UNDERLINE",
};

export const ENTITY_TYPE = {
    LINK: "LINK",
};

const BREAK = "<br>";

// Order: inner-most style to outer-most.
// Examle: <em><strong>foo</strong></em>
const DEFAULT_STYLE_ORDER = [INLINE_STYLE.BOLD, INLINE_STYLE.ITALIC, INLINE_STYLE.UNDERLINE, INLINE_STYLE.STRIKETHROUGH, INLINE_STYLE.CODE];

const DEFAULT_STYLE_MAP = {
    [INLINE_STYLE.BOLD]: { element: "i" },
    [INLINE_STYLE.ITALIC]: { element: "i" },
    [INLINE_STYLE.STRIKETHROUGH]: { element: "i" },
    [INLINE_STYLE.UNDERLINE]: { element: "i" },
};

function getTags(blockType: string): string[] {
    switch (blockType) {
        case BLOCK_TYPE.HEADER_ONE:
            return ["h1"];
        case BLOCK_TYPE.HEADER_TWO:
            return ["h2"];
        case BLOCK_TYPE.HEADER_THREE:
            return ["h3"];
        case BLOCK_TYPE.HEADER_FOUR:
            return ["h4"];
        case BLOCK_TYPE.HEADER_FIVE:
            return ["h5"];
        case BLOCK_TYPE.HEADER_SIX:
            return ["h6"];
        case BLOCK_TYPE.BLOCKQUOTE:
            return ["blockquote"];
        default:
            return [];
    }
}

function encodeContent(text: string): string {
    return text.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;").split("\xA0").join("&nbsp;").split("\n").join(`${BREAK}\n`);
}

class MarkupGenerator {
    blocks: ContentBlock[] = [];
    contentState: ContentState;
    output: string[] = [];
    currentBlock = 0;
    indentLevel = 0;
    totalBlocks = 0;
    inlineStyles = DEFAULT_STYLE_MAP;
    styleOrder: string[] = DEFAULT_STYLE_ORDER;
    indent = "  ";
    counter = 1;

    constructor(contentState: ContentState) {
        this.contentState = contentState;
    }

    generate(): string[] {
        this.output = [];
        this.blocks = this.contentState.getBlocksAsArray();
        this.totalBlocks = this.blocks.length;
        this.currentBlock = 0;
        this.indentLevel = 0;

        while (this.currentBlock < this.totalBlocks) {
            this.processBlock();
        }

        return this.output.filter((content) => content !== "" && content !== "\n");
    }

    processBlock() {
        const block = this.blocks[this.currentBlock];

        this.addIndent();

        this.writeStartTag(block);
        const content = this.renderBlockContent(block);

        this.output.push(content);

        this.currentBlock += 1;
        this.writeEndTag(block);
    }

    writeStartTag(block: ContentBlock) {
        const tags = getTags(block.getType());

        for (const tag of tags) {
            this.output.push(`<${tag}>`);
        }
    }

    writeEndTag(block: ContentBlock) {
        const tags = getTags(block.getType());
        if (tags.length === 1) {
            this.output.push(`</${tags[0]}>\n`);
        } else {
            const output = [];
            for (const tag of tags) {
                output.unshift(`</${tag}>`);
            }
            this.output.push(`${output.join("")}\n`);
        }
    }

    addIndent() {
        this.output.push(this.indent.repeat(this.indentLevel));
    }

    renderBlockContent(block: ContentBlock): string {
        let text = block.getText();
        let currentLinkId = 0;

        if (text === "") {
            // Prevent element collapse if completely empty.
            return BREAK;
        }

        text = this.preserveWhitespace(text);
        const charMetaList: CharacterMetaList = block.getCharacterList();
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

                                content = `<${element} class="${currentStyle.id}">${content}</${element}>`;
                            }
                        }

                        return content;
                    })
                    .join("");

                const entity = entityKey ? this.contentState.getEntity(entityKey) : null;
                // Note: The `toUpperCase` below is for compatability with some libraries that use lower-case for image blocks.
                const entityType = entity == null ? null : entity.getType().toUpperCase();

                if (entityType != null && entityType === ENTITY_TYPE.LINK) {
                    currentLinkId += 1;
                    return `<e class="${currentLinkId}">${content}</e>`;
                } else {
                    return content;
                }
            })
            .join("");
    }

    preserveWhitespace(text: string): string {
        const length = text.length;
        // Prevent leading/trailing/consecutive whitespace collapse.
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

export default function stateToHTML(content: ContentState): string[] {
    return new MarkupGenerator(content).generate();
}
