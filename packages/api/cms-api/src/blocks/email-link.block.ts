import { IsEmail, IsOptional } from "class-validator";

import { BlockData, BlockInput, createBlock, inputToData } from "./block";
import { BlockField } from "./decorators/field";

class EmailLinkBlockData extends BlockData {
    @BlockField({ nullable: true })
    email?: string;
}

class EmailLinkBlockInput extends BlockInput {
    @IsOptional()
    @IsEmail()
    @BlockField({ nullable: true })
    email?: string;

    transformToBlockData(): EmailLinkBlockData {
        return inputToData(EmailLinkBlockData, this);
    }
}

export const EmailLinkBlock = createBlock(EmailLinkBlockData, EmailLinkBlockInput, "EmailLink");
