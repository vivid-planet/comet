import { Migration } from "@mikro-orm/migrations";

export class Migration20250331172459 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "ProductCategory" add constraint "ProductCategory_slug_unique" unique ("slug");');
    }
}
