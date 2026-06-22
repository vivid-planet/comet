import { Migration } from "@mikro-orm/migrations";

export class Migration20260622120000 extends Migration {
    override async up(): Promise<void> {
        this.addSql(`alter table "ActionLog" add column "snapshotVersion" int null;`);
    }

    override async down(): Promise<void> {
        this.addSql(`alter table "ActionLog" drop column "snapshotVersion";`);
    }
}
