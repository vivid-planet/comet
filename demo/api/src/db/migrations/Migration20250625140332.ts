import { Migration } from "@mikro-orm/migrations";

export class Migration20250625140332 extends Migration {
    override async up(): Promise<void> {
        this.addSql(`alter table "Product" alter column "description" drop not null;`);
    }
}
