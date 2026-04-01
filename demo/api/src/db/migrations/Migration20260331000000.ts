import { Migration } from "@mikro-orm/migrations";

export class Migration20260331000000 extends Migration {
    override async up(): Promise<void> {
        this.addSql(
            `create table "AiChatConversation" ("id" uuid not null, "createdAt" timestamptz not null, constraint "AiChatConversation_pkey" primary key ("id"));`,
        );
        this.addSql(
            `create table "AiChatMessage" ("id" uuid not null, "conversation" uuid not null, "role" text check ("role" in ('user', 'assistant')) not null, "content" text not null, "createdAt" timestamptz not null, constraint "AiChatMessage_pkey" primary key ("id"));`,
        );
        this.addSql(
            `alter table "AiChatMessage" add constraint "AiChatMessage_conversation_foreign" foreign key ("conversation") references "AiChatConversation" ("id") on update cascade on delete cascade;`,
        );
    }

    override async down(): Promise<void> {
        this.addSql(`drop table if exists "AiChatMessage";`);
        this.addSql(`drop table if exists "AiChatConversation";`);
    }
}
