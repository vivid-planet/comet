import { Migration } from "@mikro-orm/migrations";

export class Migration20250612134629 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table if not exists "MailerLog" ("id" uuid not null, "to" text[] not null, "subject" text null, "createdAt" timestamp with time zone not null, "mailOptions" jsonb not null, "result" jsonb null, "additionalData" jsonb null, "type" varchar(255) null, constraint "MailerLog_pkey" primary key ("id"));',
        );
        this.addSql('create index if not exists "MailerLog_type_index" on "MailerLog" ("type");');
    }
}
