import { Migration } from "@mikro-orm/migrations";

export class Migration20231218092313 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'alter table "CometUserPermission" add column "overrideContentScopes" boolean not null default false, add column "contentScopes" jsonb not null default \'[]\'::jsonb;',
        );
        this.addSql('alter table "CometUserPermission" alter column "overrideContentScopes" drop default');
        this.addSql('alter table "CometUserPermission" alter column "contentScopes" drop default');
    }

    async down(): Promise<void> {
        this.addSql('alter table "CometUserPermission" drop column "overrideContentScopes";');
        this.addSql('alter table "CometUserPermission" drop column "contentScopes";');
    }
}
