import {
    Block,
    BlockDataInterface,
    isBlockInputInterface,
    transformToSave,
    transformToSaveIndex,
    TraversableTransformResponse,
} from "@comet/blocks-api";
import { Type } from "@mikro-orm/core";
import opentelemetry from "@opentelemetry/api";

const tracer = opentelemetry.trace.getTracer("@comet/cms-api");

export class RootBlockType extends Type<BlockDataInterface | null, TraversableTransformResponse | null> {
    public block: Block;

    constructor(block: Block) {
        super();
        this.block = block;
    }

    convertToDatabaseValue(value: BlockDataInterface | null): TraversableTransformResponse | null {
        return tracer.startActiveSpan("RootBlockType::convertToDatabaseValue", (span) => {
            span.setAttribute("rootBlock.name", this.block.name);
            if (!value) {
                span.end();
                return null;
            }
            if (!value.transformToSave) {
                span.end();
                if (isBlockInputInterface(value)) {
                    throw new Error("Can't save Block Input directly into database, you need to run transformToBlockData on it");
                } else {
                    throw new Error("Value doesn't look like BlockData");
                }
            }
            const data = transformToSave(value);
            const index = transformToSaveIndex(this.block, value);
            span.end();
            return { data, index };
        });
    }

    convertToJSValue(value: TraversableTransformResponse | null): BlockDataInterface | null {
        return tracer.startActiveSpan("RootBlockType::convertToJSValue", (span) => {
            span.setAttribute("rootBlock.name", this.block.name);
            if (!value) {
                span.end();
                return null;
            }
            let ret: BlockDataInterface;
            if (value.data && value.index) {
                ret = this.block.blockDataFactory(value.data);
            } else {
                // legacy data (from pre-index era): do a live migration
                ret = this.block.blockDataFactory(value);
            }
            span.end();
            return ret;
        });
    }

    getColumnType(): string {
        return "json";
    }
}
