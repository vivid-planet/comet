import { Migration } from "@mikro-orm/migrations";

export class Migration20250625071242 extends Migration {
    override async up(): Promise<void> {
        this.addSql(`truncate table "ProductVariant";`);
        this.addSql(`alter table "ProductVariant" add column "position" integer not null;`);
    }
}
