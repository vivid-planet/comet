import { RawDraftContentBlock, RawDraftEntityRange, RawDraftInlineStyleRange } from "draft-js";

export const HTMLToState = (block: RawDraftContentBlock): RawDraftContentBlock => {
    const regexInlineStylesPattern = /<i[0-9][0-9]?>|<\/i[0-9][0-9]?>/g;
    const regexEntitiesPattern = /<e[0-9][0-9]?>|<\/e[0-9][0-9]?>/g;

    const onlyInlineStyleTags = block.text.replace(regexEntitiesPattern, "");
    const onlyEntityRangeTags = block.text.replace(regexInlineStylesPattern, "");

    const newInlineStyleRanges: Array<RawDraftInlineStyleRange> = [];
    const newEntityRanges: Array<RawDraftEntityRange> = [];

    block.inlineStyleRanges.forEach((inlineStyleRange, index) => {
        const openingTag = `<i${index + 1}>`;
        const closingTag = `</i${index + 1}>`;

        const openingTagIndex = onlyInlineStyleTags.indexOf(openingTag);
        const closingTagIndex = onlyInlineStyleTags.indexOf(closingTag);

        const tagsBeforeStart = onlyInlineStyleTags.substring(0, openingTagIndex).match(regexInlineStylesPattern)?.join("") ?? "";
        const tagsBetweenStartAndEnd =
            onlyInlineStyleTags
                .substring(openingTagIndex + openingTag.length, closingTagIndex)
                .match(regexInlineStylesPattern)
                ?.join("") ?? "";

        newInlineStyleRanges.push({
            ...inlineStyleRange,
            offset: openingTagIndex - tagsBeforeStart.length,
            length: closingTagIndex - openingTagIndex - tagsBetweenStartAndEnd.length - openingTag.length,
        });
    });

    block.entityRanges.forEach((entityRange, index) => {
        const openingTag = `<e${index + 1}>`;
        const closingTag = `</e${index + 1}>`;

        const openingTagIndex = onlyEntityRangeTags.indexOf(openingTag);
        const closingTagIndex = onlyEntityRangeTags.indexOf(closingTag);

        const tagsBeforeStart = onlyEntityRangeTags.substring(0, openingTagIndex).match(regexEntitiesPattern)?.join("") ?? "";
        const tagsBetweenStartAndEnd =
            onlyEntityRangeTags
                .substring(openingTagIndex + openingTag.length, closingTagIndex)
                .match(regexEntitiesPattern)
                ?.join("") ?? "";

        newEntityRanges.push({
            ...entityRange,
            offset: openingTagIndex - tagsBeforeStart.length,
            length: closingTagIndex - openingTagIndex - tagsBetweenStartAndEnd.length - openingTag.length,
        });
    });

    return {
        ...block,
        text: block.text.replace(/<i[0-9][0-9]?>|<\/i[0-9][0-9]?>|<e[0-9][0-9]?>|<\/e[0-9][0-9]?>/g, ""),
        inlineStyleRanges: newInlineStyleRanges,
        entityRanges: newEntityRanges,
    };
};
