import { Migration } from "@mikro-orm/migrations";

export class Migration20260212105859 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "Product" add column "flammable" boolean not null default false;');
    }

    async down(): Promise<void> {
        this.addSql('alter table "Product" drop column "flammable";');
    }
}
