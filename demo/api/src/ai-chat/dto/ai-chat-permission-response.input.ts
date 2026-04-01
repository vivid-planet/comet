import { IsBoolean, IsString } from "class-validator";

export class AiChatPermissionResponseInput {
    @IsString()
    requestId: string;

    @IsBoolean()
    approved: boolean;
}
