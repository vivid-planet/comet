import { Migration } from "@mikro-orm/migrations";

export class Migration20250704000000 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "BrevoTargetGroup" alter column "isMainList" set default false;');
        this.addSql('update "BrevoTargetGroup" set "isMainList" = false where "isMainList" is null;');
        this.addSql('alter table "BrevoTargetGroup" alter column "isMainList" set not null;');
        this.addSql('alter table "BrevoTargetGroup" alter column "isMainList" drop default;');
    }
}
