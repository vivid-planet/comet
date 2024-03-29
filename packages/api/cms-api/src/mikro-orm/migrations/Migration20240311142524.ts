import { Migration } from "@mikro-orm/migrations";

export class Migration20240311142524 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "CometUserPermissionsLog" ("id" uuid not null default null, "userId" varchar not null default null, "firstUsedAt" timestamptz not null default null, "lastUsedAt" timestamptz not null default null, "name" varchar not null default null, "email" varchar not null default null, "permissions" text not null default null, "usages" int4 not null default null, constraint "CometUserPermissionsLog_pkey" primary key ("id"));',
        );
        this.addSql('create index "cometuserpermissionslog_userid_index" on "CometUserPermissionsLog" ("userId");');
    }

    async down(): Promise<void> {
        this.addSql('drop table if exists "CometUserPermissionsLog" cascade;');
    }
}
