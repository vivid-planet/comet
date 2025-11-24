import { Migration } from "@mikro-orm/migrations";

export class Migration20221014095718 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "Redirect" add column "scope_domain" text not null;');
    }

    async down(): Promise<void> {}
}
