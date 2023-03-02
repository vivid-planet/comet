import { Migration } from "@mikro-orm/migrations";

export class Migration20230302145445 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "PageTreeNode" add column "updatedAt" timestamp with time zone;');
        this.addSql('update "PageTreeNode" SET "updatedAt"=CURRENT_DATE');
        this.addSql('alter table "PageTreeNode" alter column "updatedAt" set not null');
    }

    async down(): Promise<void> {
        this.addSql('alter table "PageTreeNode" drop column "updatedAt";');
    }
}
