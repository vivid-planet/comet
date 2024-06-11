import { IsOptional } from "class-validator";

import { BlockData, BlockInput, createBlock, inputToData } from "./block";
import { BlockField } from "./decorators/field";
import { IsPhoneNumber } from "./validator/is-phone-number.validator";

class PhoneLinkBlockData extends BlockData {
    @BlockField({ nullable: true })
    phone?: string;
}

class PhoneLinkBlockInput extends BlockInput {
    @IsOptional()
    @IsPhoneNumber()
    @BlockField({ nullable: true })
    phone?: string;

    transformToBlockData(): PhoneLinkBlockData {
        return inputToData(PhoneLinkBlockData, this);
    }
}

export const PhoneLinkBlock = createBlock(PhoneLinkBlockData, PhoneLinkBlockInput, "PhoneLink");
