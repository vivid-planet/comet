import { Migration } from "@mikro-orm/migrations";

export class Migration20241017071404 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "Product" add column "nextNotificationEmail" type timestamptz(0) using ("nextNotificationEmail"::timestamptz(0));');
    }
}
