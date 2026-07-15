import { Migration } from "@mikro-orm/migrations";

export class Migration20241119101706 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "BrevoConfig" add column "folderId" int not null default 1;');
        this.addSql('alter table "BrevoConfig" alter column "folderId" drop default;');
    }
}
