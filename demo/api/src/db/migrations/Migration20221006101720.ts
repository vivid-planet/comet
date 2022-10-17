import { Migration } from "@mikro-orm/migrations";

export class Migration20221006101720 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "Product" add column "inStock" boolean not null;');
    }
}
