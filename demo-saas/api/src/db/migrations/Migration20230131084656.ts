import { Migration } from "@mikro-orm/migrations";

export class Migration20230131084656 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "DamFolder" add column "scope_domain" text not null;');

        this.addSql('alter table "DamFile" add column "scope_domain" text not null;');
    }

    async down(): Promise<void> {
        this.addSql('alter table "DamFile" drop column "scope_domain";');

        this.addSql('alter table "DamFolder" drop column "scope_domain";');
    }
}
