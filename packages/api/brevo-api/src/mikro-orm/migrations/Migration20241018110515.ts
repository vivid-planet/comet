import { Migration } from "@mikro-orm/migrations";

export class Migration20241018110515 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "BrevoConfig" add column "doubleOptInTemplateId" int;');
    }
}
