import { Migration } from "@mikro-orm/migrations";

export class Migration20241004111520 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "Product" add column "priceRange" jsonb null;');
    }
}
