import { DefaultDraftBlockRenderMap, DraftBlockRenderConfig, DraftBlockType } from "draft-js";
import * as Immutable from "immutable";

import { IBlocktypeConfig, IBlocktypeMap } from "../types";

export default function createBlockRenderMap({ blocktypeMap }: { blocktypeMap?: IBlocktypeMap }) {
    let customBlockRenderMap = null;

    if (blocktypeMap) {
        const customBlockRenderMapObject = Object.entries<IBlocktypeConfig>(blocktypeMap).reduce<{
            [key: string]: DraftBlockRenderConfig;
        }>((a, [key, config]) => {
            a[key] = config.renderConfig;
            return a;
        }, {});
        customBlockRenderMap = Immutable.Map<DraftBlockType, DraftBlockRenderConfig>(customBlockRenderMapObject);
    }
    return customBlockRenderMap ? DefaultDraftBlockRenderMap.merge(customBlockRenderMap) : DefaultDraftBlockRenderMap;
}
