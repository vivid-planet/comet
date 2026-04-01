import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { AiChatController } from "./ai-chat.controller";
import { AiChatService } from "./ai-chat.service";
import { AiChatConversation } from "./entities/ai-chat-conversation.entity";
import { AiChatMessage } from "./entities/ai-chat-message.entity";

@Module({
    imports: [MikroOrmModule.forFeature([AiChatConversation, AiChatMessage])],
    providers: [AiChatService],
    controllers: [AiChatController],
})
export class AiChatModule {}
