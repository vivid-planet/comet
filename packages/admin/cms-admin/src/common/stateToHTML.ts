import { CharacterMetadata, ContentBlock, ContentState, EntityInstance } from "draft-js";
import type { List } from "immutable";

/*
    This is a first, very basic implementation.
    Images, code snippets, custom options as attributes, elements or styles are not taken into account.

*/
import getEntityRanges from "./getEntityRanges";

type CharacterMetaList = List<CharacterMetadata>;
type AttrMap = { [key: string]: string };
type Attributes = { [key: string]: string };

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
    CODE: "code-block",
    ATOMIC: "atomic",
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
const DATA_ATTRIBUTE = /^data-([a-z0-9-]+)$/;

// Map entity data to element attributes.
const ENTITY_ATTR_MAP: { [entityType: string]: AttrMap } = {
    [ENTITY_TYPE.LINK]: {
        url: "href",
        href: "href",
        rel: "rel",
        target: "target",
        title: "title",
        className: "class",
    },
};

// Map entity data to element attributes.
const DATA_TO_ATTR = {
    [ENTITY_TYPE.LINK](entityType: string, entity: EntityInstance): Attributes {
        const attrMap = ENTITY_ATTR_MAP[entityType] ?? {};
        const data = entity.getData();
        const attrs: { [key: string]: string } = {};

        for (const dataKey of Object.keys(data)) {
            const dataValue = data[dataKey];
            if (attrMap[dataKey]) {
                const attrKey = attrMap[dataKey];
                attrs[attrKey] = dataValue;
            } else if (DATA_ATTRIBUTE.test(dataKey)) {
                attrs[dataKey] = dataValue;
            }
        }
        return attrs;
    },
};

// Order: inner-most style to outer-most.
// Examle: <em><strong>foo</strong></em>
const DEFAULT_STYLE_ORDER = [INLINE_STYLE.BOLD, INLINE_STYLE.ITALIC, INLINE_STYLE.UNDERLINE, INLINE_STYLE.STRIKETHROUGH, INLINE_STYLE.CODE];

const DEFAULT_STYLE_MAP = {
    [INLINE_STYLE.BOLD]: { element: "i" },
    [INLINE_STYLE.ITALIC]: { element: "i" },
    [INLINE_STYLE.STRIKETHROUGH]: { element: "i" },
    [INLINE_STYLE.UNDERLINE]: { element: "i" },
};

function getWrapperTag(blockType: string): string | null {
    switch (blockType) {
        case BLOCK_TYPE.UNORDERED_LIST_ITEM:
            return "ul";
        case BLOCK_TYPE.ORDERED_LIST_ITEM:
            return "ol";
        default:
            return null;
    }
}

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
        case BLOCK_TYPE.UNORDERED_LIST_ITEM:
        case BLOCK_TYPE.ORDERED_LIST_ITEM:
            return ["li"];
        case BLOCK_TYPE.BLOCKQUOTE:
            return ["blockquote"];
        case BLOCK_TYPE.CODE:
            return ["pre", "code"];
        case BLOCK_TYPE.ATOMIC:
            return ["figure"];
        default:
            return [];
    }
}

function canHaveDepth(blockType: string): boolean {
    switch (blockType) {
        case BLOCK_TYPE.UNORDERED_LIST_ITEM:
        case BLOCK_TYPE.ORDERED_LIST_ITEM:
            return true;
        default:
            return false;
    }
}

function encodeContent(text: string): string {
    return text.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;").split("\xA0").join("&nbsp;").split("\n").join(`${BREAK}\n`);
}

function encodeAttr(text: string): string {
    return text.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;").split('"').join("&quot;");
}

function stringifyAttrs(attrs: Attributes | null) {
    if (attrs == null) {
        return "";
    }
    const parts = [];
    for (const name of Object.keys(attrs)) {
        const value = attrs[name];
        if (value != null) {
            parts.push(` ${name}="${encodeAttr(`${value}`)}"`);
        }
    }
    return parts.join("");
}

class MarkupGenerator {
    blocks: ContentBlock[] = [];
    contentState: ContentState;
    output: string[] = [];
    currentBlock = 0;
    indentLevel = 0;
    totalBlocks = 0;
    wrapperTag: string | null = null;
    inlineStyles = DEFAULT_STYLE_MAP;
    styleOrder: string[] = DEFAULT_STYLE_ORDER;
    indent = "  ";
    counter = 1;

    constructor(contentState: ContentState) {
        this.contentState = contentState;
    }

    generate() {
        this.output = [];
        this.blocks = this.contentState.getBlocksAsArray();
        this.totalBlocks = this.blocks.length;
        this.currentBlock = 0;
        this.indentLevel = 0;
        this.wrapperTag = null;
        while (this.currentBlock < this.totalBlocks) {
            this.processBlock();
        }
        this.closeWrapperTag();
        return this.output.join("").trim();
    }

    processBlock() {
        const block = this.blocks[this.currentBlock];
        const blockType = block.getType();
        const newWrapperTag = getWrapperTag(blockType);

        if (this.wrapperTag !== newWrapperTag) {
            if (this.wrapperTag) {
                this.closeWrapperTag();
            }
            if (newWrapperTag) {
                this.openWrapperTag(newWrapperTag);
            }
        }

        this.addIndent();

        this.writeStartTag(block);
        this.output.push(this.renderBlockContent(block));

        // Look ahead and see if we will nest list.
        const nextBlock = this.getNextBlock();
        if (canHaveDepth(blockType) && nextBlock && nextBlock.getDepth() === block.getDepth() + 1) {
            this.output.push("\n");
            // This is a litle hacky: temporarily stash our current wrapperTag and
            // render child list(s).
            const thisWrapperTag = this.wrapperTag;
            this.wrapperTag = null;
            this.indentLevel += 1;
            this.currentBlock += 1;
            this.processBlocksAtDepth(nextBlock.getDepth());
            this.wrapperTag = thisWrapperTag;
            this.indentLevel -= 1;
            this.addIndent();
        } else {
            this.currentBlock += 1;
        }
        this.writeEndTag(block);
    }

    processBlocksAtDepth(depth: number) {
        let block = this.blocks[this.currentBlock];
        while (block && block.getDepth() === depth) {
            this.processBlock();
            block = this.blocks[this.currentBlock];
        }
        this.closeWrapperTag();
    }

    getNextBlock(): ContentBlock {
        return this.blocks[this.currentBlock + 1];
    }

    writeStartTag(block: ContentBlock) {
        const tags = getTags(block.getType());

        for (const tag of tags) {
            this.output.push(`<${tag}${this.counter}>`);
            this.counter += 1;
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

    openWrapperTag(wrapperTag: string) {
        this.wrapperTag = wrapperTag;
        this.addIndent();
        this.output.push(`<${wrapperTag}${this.counter}>\n`);
        this.indentLevel += 1;
    }

    closeWrapperTag() {
        if (this.wrapperTag) {
            this.indentLevel -= 1;
            this.addIndent();
            this.output.push(`</${this.wrapperTag}>\n`);
            this.wrapperTag = null;
        }
    }

    addIndent() {
        this.output.push(this.indent.repeat(this.indentLevel));
    }

    renderBlockContent(block: ContentBlock): string {
        let text = block.getText();

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
                            if (styleSet.has(styleName)) {
                                let { element } = this.inlineStyles[styleName];
                                if (element == null) {
                                    element = "span";
                                }

                                content = `<${element} class="${this.counter}">${content}</${element}>`;
                                this.counter += 1;
                            }
                        }

                        return content;
                    })
                    .join("");

                const entity = entityKey ? this.contentState.getEntity(entityKey) : null;
                // Note: The `toUpperCase` below is for compatability with some libraries that use lower-case for image blocks.
                const entityType = entity == null ? null : entity.getType().toUpperCase();

                if (entityType != null && entityType === ENTITY_TYPE.LINK) {
                    const attrs = DATA_TO_ATTR[entityType] && entity ? DATA_TO_ATTR[entityType](entityType, entity) : null;
                    const attrString = stringifyAttrs(attrs);
                    return `<a${attrString}>${content}</a>`;
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

export default function stateToHTML(content: ContentState): string {
    return new MarkupGenerator(content).generate();
}
