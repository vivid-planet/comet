import { DraftInlineStyleType, RawDraftContentBlock } from "draft-js";

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

export const XMLToState = (block: RawDraftContentBlock): RawDraftContentBlock => {
    const regexInlineStylesPattern = /<inline id="[0-9][0-9]?">|<\/inline>/g;
    const regexEntitiesPattern = /<entity id="[0-9][0-9]?">|<\/entity>/g;

    const newInlineStyleRanges: InlineStyle[] = [];
    const newEntityRanges: EntityRange[] = [];
    const stylesStack: InlineStyle[] = [];
    const entitiesStack: EntityRange[] = [];

    const onlyInlineStyles = block.text.replace(regexEntitiesPattern, "");
    const inlineStyleTags = onlyInlineStyles.matchAll(regexInlineStylesPattern);

    const onlyEntityRanges = block.text.replace(regexInlineStylesPattern, "");
    const entityRangesTags = onlyEntityRanges.matchAll(regexEntitiesPattern);

    const text = block.text.replace(regexEntitiesPattern, "").replace(regexInlineStylesPattern, "");

    let shiftCount = 0;

    for (const match of inlineStyleTags) {
        const id = match[0].match(/\d+/)?.[0];

        if (match.index === null || match.index === undefined) continue;

        const offset = match.index - shiftCount;

        if (id) {
            stylesStack.push({
                id: parseInt(id ?? ""),
                offset,
                length: 0,
            });
        } else {
            const openingTag = stylesStack.pop();

            if (openingTag) {
                const existingStyle = newInlineStyleRanges.findIndex((style) => style.id === openingTag.id);

                if (existingStyle !== -1) {
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

        shiftCount += match[0].length;
    }

    shiftCount = 0;

    for (const match of entityRangesTags) {
        const id = match[0].match(/\d+/)?.[0];

        if (match.index === null || match.index === undefined) continue;

        const offset = match.index - shiftCount;

        if (id) {
            entitiesStack.push({
                key: parseInt(id ?? ""),
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

    /* inline styles need to be sorted by offset to map style property as inline styles are sorted by style order*/
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
        .filter((styleRange) => styleRange) as EntityRange[];

    return {
        ...block,
        text,
    };
};
