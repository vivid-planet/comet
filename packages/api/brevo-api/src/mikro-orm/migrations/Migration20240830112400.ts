import { Migration } from "@mikro-orm/migrations";

export class Migration20240830112400 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "TargetGroup" add column "isTestList" boolean not null default false;');

        this.addSql('alter table "TargetGroup" alter column "isTestList" drop default;');
    }
}
