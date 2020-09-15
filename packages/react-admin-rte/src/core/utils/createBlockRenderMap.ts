import { DefaultDraftBlockRenderMap, DraftBlockRenderConfig, DraftBlockType } from "draft-js";
import * as Immutable from "immutable";
import { CoreBlockTypeMap, CustomBlockTypeMap } from "../types";

export default function createBlockRenderMap({ customBlockTypeMap }: { customBlockTypeMap?: CustomBlockTypeMap | CoreBlockTypeMap }) {
    let customBlockRenderMap = null;

    if (customBlockTypeMap) {
        const customBlockRenderMapObject = Object.entries(customBlockTypeMap).reduce<{
            [key: string]: DraftBlockRenderConfig;
        }>((a, [key, config]) => {
            if (config) {
                a[key] = config.renderConfig;
            }
            return a;
        }, {});
        customBlockRenderMap = Immutable.Map<DraftBlockType, DraftBlockRenderConfig>(customBlockRenderMapObject);
    }
    return customBlockRenderMap ? DefaultDraftBlockRenderMap.merge(customBlockRenderMap) : DefaultDraftBlockRenderMap;
}
