import { Migration } from "@mikro-orm/migrations";

export class Migration20241022144400 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "BrevoConfig" add column "allowedRedirectionUrl" text;');
    }
}
