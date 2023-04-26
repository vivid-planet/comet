import type { CharacterMetadata } from "draft-js";
import type { List } from "immutable";
import { is, OrderedSet } from "immutable";

type EntityKey = string | undefined | null;
type Style = OrderedSet<string>;
type StyleRange = [string, Style];
type EntityRange = [EntityKey, Array<StyleRange>];
export type CharacterMetaList = List<CharacterMetadata>;

export const EMPTY_SET: Style = OrderedSet();

export default function getEntityRanges(text: string, charMetaList: CharacterMetaList): EntityRange[] {
    let charEntity: EntityKey = null;
    let prevCharEntity: EntityKey = null;
    const ranges: Array<EntityRange> = [];
    let rangeStart = 0;
    for (let i = 0, len = text.length; i < len; i++) {
        prevCharEntity = charEntity;
        const meta: CharacterMetadata = charMetaList.get(i);
        charEntity = meta ? meta.getEntity() : null;
        if (i > 0 && charEntity !== prevCharEntity) {
            ranges.push([prevCharEntity, getStyleRanges(text.slice(rangeStart, i), charMetaList.slice(rangeStart, i))]);
            rangeStart = i;
        }
    }
    ranges.push([charEntity, getStyleRanges(text.slice(rangeStart), charMetaList.slice(rangeStart))]);
    return ranges;
}

function getStyleRanges(text: string, charMetaList: Immutable.Iterable<number, CharacterMetadata>): StyleRange[] {
    let charStyle = EMPTY_SET;
    let prevCharStyle = EMPTY_SET;
    const ranges: StyleRange[] = [];
    let rangeStart = 0;
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
    return ranges;
}
