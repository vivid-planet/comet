import { Module } from "@nestjs/common";

import { AiChatController } from "./ai-chat.controller";

@Module({
    controllers: [AiChatController],
})
export class AiChatModule {}
