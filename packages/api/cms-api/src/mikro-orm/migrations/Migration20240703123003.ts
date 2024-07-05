import { Migration } from "@mikro-orm/migrations";

export class Migration20240703123003 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "DamFolder" add column "isSharedBetweenAllScopes" boolean not null default false;');
        this.addSql('alter table "DamFolder" alter column "isSharedBetweenAllScopes" drop default');
    }

    async down(): Promise<void> {
        this.addSql('alter table "DamFolder" drop column "isSharedBetweenAllScopes";');
    }
}
