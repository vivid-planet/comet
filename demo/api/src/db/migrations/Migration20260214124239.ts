import { Migration } from "@mikro-orm/migrations";

export class Migration20260214124239 extends Migration {
    override async up(): Promise<void> {
        this.addSql(`alter table "Product" add column "disclaimer" json not null;`);
    }
}
