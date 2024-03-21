import { Migration } from "@mikro-orm/migrations";

export class Migration20240313101925 extends Migration {
    async up(): Promise<void> {
        this.addSql('truncate table "News" cascade;');
        this.addSql('alter table "News" add column "status" text check ("status" in (\'Active\', \'Deleted\')) not null;');
        this.addSql('alter table "News" drop column "visible";');
    }
}
