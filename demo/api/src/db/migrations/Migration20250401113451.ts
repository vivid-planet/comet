import { Migration } from "@mikro-orm/migrations";

export class Migration20250401113451 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "Product" add constraint "Product_slug_unique" unique ("slug");');
    }
}
