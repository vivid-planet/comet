import { Migration } from "@mikro-orm/migrations";

export class Migration20250221073825 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "BrevoConfig" drop column "scope_domain", drop column "scope_language";');
    }
}
