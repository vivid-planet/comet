import { Migration } from "@mikro-orm/migrations";

export class Migration20230221101720 extends Migration {
    async up(): Promise<void> {
        this.addSql('truncate table "Product";');
        this.addSql('alter table "Product" add column "image" json not null;');
    }
}
