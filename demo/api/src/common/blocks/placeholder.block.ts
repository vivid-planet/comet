import { BlockData, BlockField, BlockInput, blockInputToData, createBlock, IsUndefinable } from "@comet/cms-api";
import { IsEnum, IsString } from "class-validator";

export enum PlaceholderField {
    title = "title",
    price = "price",
}

class PlaceholderBlockData extends BlockData {
    @BlockField({ nullable: true })
    productId?: string;

    @BlockField({ type: "enum", enum: PlaceholderField })
    field: PlaceholderField;
}

class PlaceholderBlockInput extends BlockInput {
    @IsUndefinable()
    @IsString()
    @BlockField({ nullable: true })
    productId?: string;

    @IsEnum(PlaceholderField)
    @BlockField({ type: "enum", enum: PlaceholderField })
    field: PlaceholderField;

    transformToBlockData(): PlaceholderBlockData {
        return blockInputToData(PlaceholderBlockData, this);
    }
}

export const PlaceholderBlock = createBlock(PlaceholderBlockData, PlaceholderBlockInput, "Placeholder");
