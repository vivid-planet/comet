import {
    ContentState,
    convertFromRaw,
    DraftInlineStyleType,
    EditorState,
    RawDraftContentBlock,
    RawDraftContentState,
    RawDraftEntity,
} from "draft-js";

import { blockToXml } from "./transformStateToXml";

interface InlineStyle {
    id: number;
    offset: number;
    length: number;
}

interface EntityRange {
    key: number;
    offset: number;
    length: number;
}

/* 
    turns escaped special characters in the xml back to text for content
*/
function decodeContent(text: string): string {
    return text.split("&amp;").join("&").split("&lt;").join("<").split("&gt;").join(">").split("&nbsp;").join("\xA0");
}

export const updateBlockContent = (block: RawDraftContentBlock) => {
    const regexInlineStylesPattern = /<inline id="[0-9][0-9]?">|<\/inline>/g;
    const regexEntitiesPattern = /<entity id="[0-9][0-9]?">|<\/entity>/g;

    const newInlineStyleRanges: InlineStyle[] = [];
    const newEntityRanges: EntityRange[] = [];
    const stylesStack: InlineStyle[] = [];
    const entitiesStack: EntityRange[] = [];

    // process only inline style ranges and their associated pseudo tags
    const onlyInlineStyles = block.text.replace(regexEntitiesPattern, "");
    const inlineStyleTags = onlyInlineStyles.matchAll(regexInlineStylesPattern);

    // process only entity ranges and their associated pseudo tags
    const onlyEntityRanges = block.text.replace(regexInlineStylesPattern, "");
    const entityRangesTags = onlyEntityRanges.matchAll(regexEntitiesPattern);

    const text = block.text.replace(regexEntitiesPattern, "").replace(regexInlineStylesPattern, "");

    // counts the number of characters of previous pseudo tags to keep the correct index shift
    let shiftCount = 0;

    for (const match of inlineStyleTags) {
        const id = match[0].match(/\d+/)?.[0]; // get id of opening pseudo tag

        if (match.index === null || match.index === undefined) continue;

        const offset = match.index - shiftCount;

        if (id) {
            // opening pseudo tags are added to the stack
            stylesStack.push({
                id: parseInt(id),
                offset,
                length: 0,
            });
        } else {
            // take top element of stack when closing pseudo tags occurs
            const openingTag = stylesStack.pop();

            if (openingTag) {
                // check if style already occured before
                const existingStyle = newInlineStyleRanges.findIndex((style) => style.id === openingTag.id);

                if (existingStyle !== -1) {
                    // update range length of style
                    newInlineStyleRanges[existingStyle] = {
                        ...newInlineStyleRanges[existingStyle],
                        length: newInlineStyleRanges[existingStyle].length + (offset - openingTag.offset),
                    };
                } else {
                    newInlineStyleRanges.push({
                        id: openingTag.id,
                        offset: openingTag.offset,
                        length: offset - openingTag.offset,
                    });
                }
            }
        }

        // update index shift according to pseudo tag length
        shiftCount += match[0].length;
    }

    shiftCount = 0;

    // entity ranges work the same way as inline styles
    for (const match of entityRangesTags) {
        const id = match[0].match(/\d+/)?.[0];

        if (match.index === null || match.index === undefined) continue;

        const offset = match.index - shiftCount;

        if (id) {
            entitiesStack.push({
                key: parseInt(id),
                offset,
                length: 0,
            });
        } else {
            const openingTag = entitiesStack.pop();

            if (openingTag) {
                const existingStyle = newEntityRanges.findIndex((style) => style.key === openingTag.key);

                if (existingStyle !== -1) {
                    newEntityRanges[existingStyle] = {
                        ...newEntityRanges[existingStyle],
                        length: newEntityRanges[existingStyle].length + (offset - openingTag.offset),
                    };
                } else {
                    newEntityRanges.push({
                        key: openingTag.key,
                        offset: openingTag.offset,
                        length: offset - openingTag.offset,
                    });
                }
            }
        }

        shiftCount += match[0].length;
    }

    /* inline styles need to be sorted by offset to map style property as inline styles are sorted by style order */
    block.inlineStyleRanges = block.inlineStyleRanges
        .sort((a, b) => a.offset - b.offset)
        .map((style, index) => {
            const newStyle = newInlineStyleRanges.find((newStyle) => newStyle.id - 1 === index);

            if (!newStyle) {
                return undefined;
            }

            return {
                ...style,
                offset: newStyle?.offset ?? style.offset,
                length: newStyle?.length ?? style.length,
            };
        })
        .filter((styleRange) => styleRange) as {
        offset: number;
        length: number;
        style: DraftInlineStyleType;
    }[];

    block.entityRanges = block.entityRanges
        .map((entityRange) => {
            const newEntityRange = newEntityRanges.find((newEntityRange) => newEntityRange.key - 1 === entityRange.key);

            if (!newEntityRange) {
                return undefined;
            }

            return {
                ...entityRange,
                offset: newEntityRange?.offset ?? entityRange.offset,
                length: newEntityRange?.length ?? entityRange.length,
            };
        })
        .filter((entityRange) => entityRange) as EntityRange[];

    return {
        ...block,
        text,
    };
};

export const translateAndTransformXmlToState = (
    state: ContentState,
    rawContent: RawDraftContentState,
    contents: { original: string; replaceWith: string }[],
) => {
    let newEntityMap: { [key: number]: RawDraftEntity } = {};

    const contentBlocks = state.getBlocksAsArray();

    const translatedBlocks = rawContent.blocks.map((block, index) => {
        const xmlBlockContent = blockToXml(contentBlocks[index], state);

        const translation = contents.find((content) => content.original === xmlBlockContent);
        if (!translation || translation.replaceWith === "") return block;

        const newBlockstate = updateBlockContent({ ...block, text: translation.replaceWith });

        newBlockstate.entityRanges.forEach((entityRange) => {
            newEntityMap = { ...newEntityMap, [entityRange.key]: rawContent.entityMap[entityRange.key] };
        });

        return { ...newBlockstate, text: decodeContent(newBlockstate.text) };
    });

    return EditorState.createWithContent(convertFromRaw({ blocks: translatedBlocks, entityMap: newEntityMap }));
};
