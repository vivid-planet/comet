import { Migration } from "@mikro-orm/migrations";

export class Migration20240619092554 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "TargetGroup" add column "assignedContactsTargetGroupBrevoId" int null;');
    }
}
