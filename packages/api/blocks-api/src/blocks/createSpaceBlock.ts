import { IsEnum } from "class-validator";

import { Block, BlockData, BlockDataInterface, BlockInput, createBlock, inputToData, SimpleBlockInputInterface } from "./block";
import { BlockField } from "./decorators/field";
import { BlockFactoryNameOrOptions } from "./factories/types";

interface CreateSpaceBlockOptions<SpacingOptions extends string[] | Record<string, string>> {
    spacing: SpacingOptions;
}

type SingleEnumType<SpacingOptions extends string[] | Record<string, string>> = SpacingOptions extends string[]
    ? SpacingOptions[number]
    : keyof SpacingOptions;

interface SpaceBlockInputInterface<SpacingOptions extends string[] | Record<string, string>> extends SimpleBlockInputInterface {
    spacing: SingleEnumType<SpacingOptions>;
}

export function createSpaceBlock<SpacingOptions extends string[] | Record<string, string>>(
    { spacing: Spacing }: CreateSpaceBlockOptions<SpacingOptions>,
    nameOrOptions: BlockFactoryNameOrOptions = "Space",
): Block<BlockDataInterface, SpaceBlockInputInterface<SpacingOptions>> {
    class SpaceBlockData extends BlockData {
        @BlockField({ type: "enum", enum: Spacing })
        spacing: SingleEnumType<SpacingOptions>;
    }

    class SpaceBlockInput extends BlockInput {
        @IsEnum(Spacing)
        @BlockField({ type: "enum", enum: Spacing })
        spacing: SingleEnumType<SpacingOptions>;

        transformToBlockData(): SpaceBlockData {
            return inputToData(SpaceBlockData, this);
        }
    }

    return createBlock(SpaceBlockData, SpaceBlockInput, nameOrOptions);
}
