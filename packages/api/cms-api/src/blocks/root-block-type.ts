import {
    Block,
    BlockDataInterface,
    isBlockInputInterface,
    transformToSave,
    transformToSaveIndex,
    TraversableTransformResponse,
} from "@comet/blocks-api";
import { Type } from "@mikro-orm/core";

export class RootBlockType extends Type<BlockDataInterface | null, TraversableTransformResponse | null> {
    private block: Block;

    constructor(block: Block) {
        super();

        this.block = block;
    }

    convertToDatabaseValue(value: BlockDataInterface | null): TraversableTransformResponse | null {
        if (!value) return null;
        if (!value.transformToSave) {
            if (isBlockInputInterface(value)) {
                throw new Error("Can't save Block Input directly into database, you need to run transformToBlockData on it");
            } else {
                throw new Error("Value doesn't look like BlockData");
            }
        }
        const data = transformToSave(value);
        const index = transformToSaveIndex(this.block, value);

        return { data, index };
    }

    convertToJSValue(value: TraversableTransformResponse | null): BlockDataInterface | null {
        if (!value) return null;

        if (value.data && value.index) {
            return this.block.blockDataFactory(value.data);
        } else {
            // legacy data (from pre-index era): do a live migration
            return this.block.blockDataFactory(value);
        }
    }

    getColumnType(): string {
        return "json";
    }
}
