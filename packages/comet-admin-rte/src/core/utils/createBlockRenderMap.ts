import { DefaultDraftBlockRenderMap, DraftBlockRenderConfig, DraftBlockType } from "draft-js";
import * as Immutable from "immutable";

import { ICustomBlockType, ICustomBlockTypeMap } from "../types";

export default function createBlockRenderMap({ customBlockTypeMap }: { customBlockTypeMap?: ICustomBlockTypeMap }) {
    let customBlockRenderMap = null;

    if (customBlockTypeMap) {
        const customBlockRenderMapObject = Object.entries<ICustomBlockType>(customBlockTypeMap).reduce<{
            [key: string]: DraftBlockRenderConfig;
        }>((a, [key, config]) => {
            a[key] = config.renderConfig;
            return a;
        }, {});
        customBlockRenderMap = Immutable.Map<DraftBlockType, DraftBlockRenderConfig>(customBlockRenderMapObject);
    }
    return customBlockRenderMap ? DefaultDraftBlockRenderMap.merge(customBlockRenderMap) : DefaultDraftBlockRenderMap;
}
