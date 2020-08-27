import { DefaultDraftBlockRenderMap, DraftBlockRenderConfig, DraftBlockType } from "draft-js";
import * as Immutable from "immutable";
import { ICoreBlockType, ICoreBlockTypeMap, ICustomBlockType, ICustomBlockTypeMap } from "../types";

export default function createBlockRenderMap({ customBlockTypeMap }: { customBlockTypeMap?: ICustomBlockTypeMap | ICoreBlockTypeMap }) {
    let customBlockRenderMap = null;

    if (customBlockTypeMap) {
        const customBlockRenderMapObject = Object.entries<ICustomBlockType | ICoreBlockType>(customBlockTypeMap).reduce<{
            [key: string]: DraftBlockRenderConfig;
        }>((a, [key, config]) => {
            a[key] = config.renderConfig;
            return a;
        }, {});
        customBlockRenderMap = Immutable.Map<DraftBlockType, DraftBlockRenderConfig>(customBlockRenderMapObject);
    }
    return customBlockRenderMap ? DefaultDraftBlockRenderMap.merge(customBlockRenderMap) : DefaultDraftBlockRenderMap;
}
