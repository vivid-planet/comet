import { BlockData, BlockField, BlockInput, createBlock, inputToData } from "@comet/blocks-api";
import { IsEmail, IsOptional } from "class-validator";

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
