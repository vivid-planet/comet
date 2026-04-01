import { IsString } from "class-validator";

export class AiChatStreamInput {
    @IsString()
    conversationId: string;

    @IsString()
    message: string;
}
