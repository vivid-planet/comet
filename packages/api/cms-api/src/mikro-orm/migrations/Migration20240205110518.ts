import { Migration } from "@mikro-orm/migrations";

export class Migration20240205110518 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "CometUserPermission" add configuration jsonb default null;');
    }

    async down(): Promise<void> {
        this.addSql('alter table "CometUserPermission" drop configuration;');
    }
}
