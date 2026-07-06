import { Migration } from "@mikro-orm/migrations";

export class Migration20240115095733 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "EmailCampaign" ("id" uuid not null, "createdAt" timestamp with time zone not null, "updatedAt" timestamp with time zone not null, "title" text not null, "subject" text not null, "scheduledAt" timestamp with time zone null, "brevoId" int null, "contactList" uuid null, "content" json not null, constraint "Campaign_pkey" primary key ("id"));',
        );
    }
}
