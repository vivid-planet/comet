import { BlockData, BlockField, BlockInput, inputToData } from "@comet/blocks-api";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class BaseFieldBlockData extends BlockData {
    @BlockField({ nullable: true })
    label?: string;

    @BlockField()
    required: boolean;

    @BlockField()
    name: string;
}

export class BaseFieldBlockInput extends BlockInput {
    @IsString()
    @IsOptional()
    @BlockField({ nullable: true })
    label?: string;

    @IsBoolean()
    @BlockField()
    required: boolean;

    @IsString()
    @BlockField()
    name: string;

    transformToBlockData(): BaseFieldBlockData {
        return inputToData(BaseFieldBlockData, this);
    }
}
