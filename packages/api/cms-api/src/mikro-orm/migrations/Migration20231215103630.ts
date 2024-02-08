import { Migration } from "@mikro-orm/migrations";

export class Migration20231215103630 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "CometUserContentScopes" ("userId" varchar(255) not null, "contentScopes" jsonb not null, constraint "CometUserContentScopes_pkey" primary key ("userId"));',
        );
        this.addSql(
            'create table "CometUserPermission" ("id" uuid not null, "userId" varchar(255) not null, "permission" text not null, "validFrom" date null, "validTo" date null, "reason" text null, "requestedBy" text null, "approvedBy" text null, constraint "CometUserPermission_pkey" primary key ("id"));',
        );
    }

    async down(): Promise<void> {
        this.addSql('drop table if exists "CometUserContentScopes" cascade;');
        this.addSql('drop table if exists "CometUserPermission" cascade;');
    }
}
