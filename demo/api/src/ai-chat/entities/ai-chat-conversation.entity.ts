import { OptionalProps, QueryOrder } from "@mikro-orm/core";
import { Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/postgresql";
import { v4 as uuid } from "uuid";

import { AiChatMessage } from "./ai-chat-message.entity";

@Entity()
export class AiChatConversation {
    [OptionalProps]?: "createdAt";

    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property({ columnType: "timestamp with time zone" })
    createdAt: Date = new Date();

    @OneToMany(() => AiChatMessage, (msg) => msg.conversation, { orderBy: { createdAt: QueryOrder.ASC } })
    messages = new Collection<AiChatMessage>(this);
}
