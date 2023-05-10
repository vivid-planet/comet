import { DraftInlineStyleType, RawDraftContentBlock } from "draft-js";

interface InlineStyle {
    id: number;
    offset: number;
    length: number;
}

export const HTMLToState = (block: RawDraftContentBlock): RawDraftContentBlock => {
    const regexInlineStylesPattern = /<i class="[0-9][0-9]?">|<\/i>/g;
    // const regexEntitiesPattern = /<e class="[0-9][0-9]?">|<\/e>/g;

    // const onlyEntityRangeTags = block.text.replace(regexInlineStylesPattern, "");

    // const newEntityRanges: Array<RawDraftEntityRange> = [];
    const newInlineStyleRanges: InlineStyle[] = [];
    const stylesStack: InlineStyle[] = [];

    const inlineStyleTags = block.text.matchAll(regexInlineStylesPattern);

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

    return {
        ...block,
        text: block.text.replace(/<i class="[0-9][0-9]?">|<\/i>|<e class="[0-9][0-9]?">|<\/e>/g, ""),
        entityRanges: block.entityRanges,
    };
};
