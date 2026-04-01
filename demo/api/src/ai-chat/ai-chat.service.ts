import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";

import { AiChatConversation } from "./entities/ai-chat-conversation.entity";
import { AiChatMessage, AiChatMessageRole } from "./entities/ai-chat-message.entity";

@Injectable()
export class AiChatService {
    constructor(private readonly em: EntityManager) {}

    async getOrCreateConversation(id: string): Promise<AiChatConversation> {
        const existing = await this.em.findOne(AiChatConversation, { id }, { populate: ["messages"] });
        if (existing) {
            return existing as AiChatConversation;
        }
        const conversation = this.em.create(AiChatConversation, { id });
        await this.em.persistAndFlush(conversation);
        return conversation as AiChatConversation;
    }

    async addMessage(conversation: AiChatConversation, role: AiChatMessageRole, content: string): Promise<void> {
        const message = this.em.create(AiChatMessage, { conversation, role, content });
        await this.em.persistAndFlush(message);
    }
}
