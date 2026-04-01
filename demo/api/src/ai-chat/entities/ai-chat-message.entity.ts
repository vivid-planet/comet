import { OptionalProps } from "@mikro-orm/core";
import { Entity, Enum, ManyToOne, PrimaryKey, Property } from "@mikro-orm/postgresql";
import { v4 as uuid } from "uuid";

import { AiChatConversation } from "./ai-chat-conversation.entity";

export enum AiChatMessageRole {
    User = "user",
    Assistant = "assistant",
}

@Entity()
export class AiChatMessage {
    [OptionalProps]?: "createdAt";

    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @ManyToOne(() => AiChatConversation)
    conversation: AiChatConversation;

    @Enum({ items: () => AiChatMessageRole })
    role: AiChatMessageRole;

    @Property({ columnType: "text" })
    content: string;

    @Property({ columnType: "timestamp with time zone" })
    createdAt: Date = new Date();
}
