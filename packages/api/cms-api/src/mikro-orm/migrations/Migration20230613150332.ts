import { Migration } from "@mikro-orm/migrations";

export class Migration20230613150332 extends Migration {
    async up(): Promise<void> {
        this.addSql('truncate "ChangesSinceLastBuild";');
        this.addSql('alter table "ChangesSinceLastBuild" add column "scope" jsonb not null;');
    }
}
