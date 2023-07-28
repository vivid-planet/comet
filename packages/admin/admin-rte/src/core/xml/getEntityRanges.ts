import type { CharacterMetadata } from "draft-js";
import type { List } from "immutable";
import { is, OrderedSet } from "immutable";

type EntityKey = string | undefined | null;
type Style = OrderedSet<string>;
type StyleRangeWithId = [string, { style: string; id: number }[]];
type StyleRange = [string, Style];
type EntityRange = [EntityKey, Array<StyleRangeWithId>];
export type CharacterMetaList = List<CharacterMetadata>;

export const EMPTY_SET: Style = OrderedSet();

/*
    This implementation is inspired by https://github.com/jpuri/draftjs-to-html.
*/
export default function getEntityRanges(text: string, charMetaList: CharacterMetaList): EntityRange[] {
    let charEntity: EntityKey = null;
    let prevCharEntity: EntityKey = null;
    const ranges: Array<EntityRange> = [];
    let rangeStart = 0;
    let lastStyle = null;
    // the id is used for the pseudotags
    let styleId = 0;

    for (let i = 0, len = text.length; i < len; i++) {
        prevCharEntity = charEntity;
        const meta: CharacterMetadata = charMetaList.get(i);
        charEntity = meta ? meta.getEntity() : null;

        if (i > 0 && charEntity !== prevCharEntity) {
            /* Styles are always within entities */
            const styleRanges = getStyleRanges(text.slice(rangeStart, i), charMetaList.slice(rangeStart, i), lastStyle, styleId);
            styleId = styleRanges.styleId;
            ranges.push([prevCharEntity, styleRanges.styleRanges]);
            rangeStart = i;
            lastStyle = ranges[ranges.length - 1];
        }
    }

    ranges.push([charEntity, getStyleRanges(text.slice(rangeStart), charMetaList.slice(rangeStart), lastStyle, styleId).styleRanges]);

    return ranges;
}

function getStyleRanges(
    text: string,
    charMetaList: Immutable.Iterable<number, CharacterMetadata>,
    lastStyle: EntityRange | null,
    styleId: number,
): { styleRanges: StyleRangeWithId[]; styleId: number } {
    let charStyle = EMPTY_SET;
    let prevCharStyle = charStyle;
    const ranges: StyleRange[] = [];
    let rangeStart = 0;

    /* The start and end of an entity always mark a single range.
If a style range starts before an entity range and extends into it, the last style must be used here, otherwise it will be interpreted as a new style range. */
    const lastPreviousStyleRange = lastStyle ? lastStyle[1][lastStyle[1].length - 1][1] : [];

    for (let i = 0, len = text.length; i < len; i++) {
        prevCharStyle = charStyle;
        const meta = charMetaList.get(i);
        charStyle = meta ? meta.getStyle() : EMPTY_SET;

        if (i > 0 && !is(charStyle, prevCharStyle)) {
            ranges.push([text.slice(rangeStart, i), prevCharStyle]);
            rangeStart = i;
        }
    }
    ranges.push([text.slice(rangeStart), charStyle]);

    const styleRangesWithIds: [string, { style: string; id: number }[]][] = [];

    // This adds ids to the styles to identify related styling tags in export
    for (let i = 0; i < ranges.length; i++) {
        const stylesArray = ranges[i][1].toArray();

        const styles = stylesArray.map((style) => {
            // when entity ranges are in the text, the text is split up at their positions, therefore it's needed to look at the previous style
            const enduringStyle = lastPreviousStyleRange.find((item) => item.style === style);

            if (enduringStyle && ranges[i - 1]?.[1].toArray().length !== 0) {
                return { style, id: enduringStyle.id };
            } else if (i > 0 && ranges[i - 1][1].toArray().includes(style)) {
                const previousStyle = styleRangesWithIds[i - 1][1].find((previousStyle) => previousStyle.style === style);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                return { style, id: previousStyle!.id };
            }

            styleId += 1;

            return { style, id: styleId };
        });

        styleRangesWithIds.push([ranges[i][0], styles]);
    }

    return { styleRanges: styleRangesWithIds, styleId };
}
