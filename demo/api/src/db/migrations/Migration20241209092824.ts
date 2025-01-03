import { Migration } from "@mikro-orm/migrations";

export class Migration20241209092824 extends Migration {
    async up(): Promise<void> {
        this.addSql('truncate table "Page";');
        this.addSql('alter table "Page" add column "stage" json not null;');
    }
}
