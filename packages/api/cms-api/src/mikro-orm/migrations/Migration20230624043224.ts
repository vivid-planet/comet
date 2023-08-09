import { Migration } from "@mikro-orm/migrations";

export class Migration20230624043224 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "UserContentScopes" ("userId" varchar(255) not null, "scopes" jsonb not null, constraint "UserContentScopes_pkey" primary key ("userId"));',
        );
        this.addSql(
            'create table "UserPermission" ("id" uuid not null, "userId" varchar(255) not null, "permission" text not null, "configuration" jsonb null, "validFrom" date null, "validTo" date null, "reason" text null, "requestedBy" text null, "approvedBy" text null, "overrideContentScopes" boolean not null default false, "contentScopes" jsonb not null, constraint "UserPermission_pkey" primary key ("id"));',
        );
    }

    async down(): Promise<void> {
        this.addSql('drop table if exists "UserContentScopes" cascade;');
        this.addSql('drop table if exists "UserPermission" cascade;');
    }
}
