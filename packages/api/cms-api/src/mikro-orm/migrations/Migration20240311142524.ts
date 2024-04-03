import { Migration } from "@mikro-orm/migrations";

export class Migration20240311142524 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "CometUserPermissionsLog" ("id" uuid not null, "userId" varchar(255) not null, "name" varchar(255) not null, "email" varchar(255) not null, "permissions" jsonb not null, "firstUsedAt" timestamptz(0) not null, "lastUsedAt" timestamptz(0) not null, constraint "CometUserPermissionsLog_pkey" primary key ("id", "userId"));',
        );
        this.addSql('create index "CometUserPermissionsLog_userId_index" on "CometUserPermissionsLog" ("userId");');
    }

    async down(): Promise<void> {
        this.addSql('drop table if exists "CometUserPermissionsLog" cascade;');
    }
}
