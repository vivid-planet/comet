import { IsString } from "class-validator";

import { BlockData, BlockInput, createBlock, inputToData } from "./block";
import { BlockField } from "./decorators/field";

class PhoneLinkBlockData extends BlockData {
    @BlockField()
    phone: string;
}

class PhoneLinkBlockInput extends BlockInput {
    @IsString()
    @BlockField()
    phone: string;

    transformToBlockData(): PhoneLinkBlockData {
        return inputToData(PhoneLinkBlockData, this);
    }
}

export const PhoneLinkBlock = createBlock(PhoneLinkBlockData, PhoneLinkBlockInput, "PhoneLink");
