import { Transform } from "class-transformer";
import { IsBoolean, IsOptional, ValidateNested } from "class-validator";

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
    isBlockDataInterface,
    isBlockInputInterface,
    SimpleBlockInputInterface,
    TraversableTransformResponse,
} from "../block";
import { BlockField } from "../decorators/field";
import { TransformDependencies } from "../dependencies";
import { BlockFactoryNameOrOptions } from "./types";

export interface OptionalBlockInputInterface<DecoratedBlockInput extends BlockInputInterface> extends SimpleBlockInputInterface {
    block?: DecoratedBlockInput;
    visible: boolean;
}

export function createOptionalBlock<DecoratedBlock extends Block>(
    block: DecoratedBlock,
    nameOrOptions: BlockFactoryNameOrOptions = `Optional${block.name}`,
): Block<BlockDataInterface, OptionalBlockInputInterface<ExtractBlockInput<DecoratedBlock>>> {
    class BlockOptional extends BlockData {
        @BlockField({ type: "block", block, nullable: true })
        @Transform(({ value }) => (value ? (isBlockDataInterface(value) ? value : block.blockDataFactory(value)) : undefined), { toClassOnly: true })
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
        @BlockField({ type: "block", block, nullable: true })
        @Transform(({ value }) => (value ? (isBlockInputInterface(value) ? value : block.blockInputFactory(value)) : undefined), {
            toClassOnly: true,
        })
        @ValidateNested()
        @IsOptional()
        block?: ExtractBlockInput<DecoratedBlock>;

        @IsBoolean()
        @BlockField()
        visible: boolean;

        transformToBlockData(): BlockOptional {
            return inputToData(BlockOptional, this);
        }
    }

    return createBlock(BlockOptional, BlockOptionalInput, nameOrOptions);
}
