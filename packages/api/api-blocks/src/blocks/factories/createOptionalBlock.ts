import { IsBoolean, IsOptional } from "class-validator";

import {
    Block,
    BlockContext,
    BlockData,
    BlockDataInterface,
    BlockInput,
    BlockInputInterface,
    ChildBlockInfo,
    createBlock,
    ExtractBlockInput,
    inputToData,
    MigrateOptions,
    SimpleBlockInputInterface,
    TraversableTransformResponse,
} from "../block";
import { ChildBlock } from "../decorators/child-block";
import { ChildBlockInput } from "../decorators/child-block-input";
import { BlockField } from "../decorators/field";
import { TransformDependencies } from "../dependencies";

export interface OptionalBlockInputInterface<DecoratedBlockInput extends BlockInputInterface> extends SimpleBlockInputInterface {
    block?: DecoratedBlockInput;
    visible: boolean;
}

export function createOptionalBlock<DecoratedBlock extends Block>(
    block: DecoratedBlock,
    options: { migrate?: MigrateOptions } = {},
): Block<BlockDataInterface, OptionalBlockInputInterface<ExtractBlockInput<DecoratedBlock>>> {
    class BlockOptional extends BlockData {
        @ChildBlock(block, { nullable: true })
        block?: BlockDataInterface;

        @BlockField()
        visible: boolean;

        async transformToPlain(deps: TransformDependencies, { includeInvisibleContent }: BlockContext): Promise<TraversableTransformResponse> {
            return {
                block: (includeInvisibleContent || this.visible) && this.block ? this.block : null,
                visible: this.visible,
            };
        }

        childBlocksInfo(): ChildBlockInfo[] {
            const ret: ChildBlockInfo[] = [];
            if (this.block) {
                ret.push({
                    visible: this.visible,
                    relJsonPath: ["block"],
                    block: this.block,
                    name: block.name,
                });
            }
            return ret;
        }
    }

    class BlockOptionalInput extends BlockInput {
        @ChildBlockInput(block, { nullable: true })
        @IsOptional()
        block?: ExtractBlockInput<DecoratedBlock>;

        @IsBoolean()
        @BlockField()
        visible: boolean;

        transformToBlockData(): BlockOptional {
            return inputToData(BlockOptional, this);
        }
    }

    return createBlock(BlockOptional, BlockOptionalInput, { name: `Optional${block.name}`, ...options });
}
