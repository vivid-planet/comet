import { Migration } from "@mikro-orm/migrations";

export class Migration20250403134629 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "Redirect" add column "activatedAt" timestamp with time zone null;');
    }
}
