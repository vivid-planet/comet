import { Migration } from "@mikro-orm/migrations";

export class Migration20230808085034 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "DamFile" add column "importSourceId" text null, add column "importSourceType" text null;');
    }
}
