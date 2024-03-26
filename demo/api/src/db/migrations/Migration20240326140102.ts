import { Migration } from "@mikro-orm/migrations";

export class Migration20240326140102 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "Product" add column "availableSince2" timestamptz(0) null;');
    }
}
