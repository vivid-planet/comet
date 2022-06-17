import { Block, BlockDataInterface, transformToSave, transformToSaveIndex, TraversableTransformResponse } from "@comet/blocks-api";
import { Type } from "@mikro-orm/core";

export class RootBlockType extends Type<BlockDataInterface | null, TraversableTransformResponse | null> {
    public block: Block;

    constructor(block: Block) {
        super();

        this.block = block;
    }

    convertToDatabaseValue(value: BlockDataInterface | null): TraversableTransformResponse | null {
        if (!value) return null;
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
