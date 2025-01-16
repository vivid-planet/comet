import { BlockData, BlockField, BlockInput, inputToData } from "@comet/blocks-api";
import { IsUndefinable } from "@comet/cms-api";
import { IsBoolean, IsString } from "class-validator";

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
    @IsUndefinable()
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
