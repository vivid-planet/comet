import { BlockData, BlockField, BlockInput, createBlock, inputToData } from "@comet/blocks-api";
import { IsOptional } from "class-validator";

import { IsPhoneNumber } from "../common/validators/is-phone-number";

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
