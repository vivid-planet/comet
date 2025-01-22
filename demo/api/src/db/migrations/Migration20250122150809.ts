import { Migration } from "@mikro-orm/migrations";

export class Migration20250122150809 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "DamFolder" add column "scope_language" text not null;');
        this.addSql('alter table "DamFile" add column "scope_language" text not null;');
    }
}
