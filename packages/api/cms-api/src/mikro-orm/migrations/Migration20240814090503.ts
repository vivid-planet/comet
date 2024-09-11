import { Migration } from "@mikro-orm/migrations";

export class Migration20240814090503 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "DamFolder" alter column "archived" type boolean using ("archived"::boolean);');
        this.addSql('alter table "DamFolder" alter column "archived" set default false;');
        this.addSql('alter table "DamFolder" alter column "isInboxFromOtherScope" type boolean using ("isInboxFromOtherScope"::boolean);');
        this.addSql('alter table "DamFolder" alter column "isInboxFromOtherScope" set default false;');

        this.addSql('alter table "DamFile" alter column "archived" type boolean using ("archived"::boolean);');
        this.addSql('alter table "DamFile" alter column "archived" set default false;');
    }
}
