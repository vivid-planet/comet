import { Migration } from "@mikro-orm/migrations";

export class Migration20231204140305 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "PageTreeNode" alter column "hideInMenu" drop default');
        this.addSql('alter table "Redirect" alter column "active" drop default');
        this.addSql('alter table "DamFile" alter column "archived" drop default');
        this.addSql('alter table "DamFolder" alter column "archived" drop default');
        this.addSql('alter table "DamFolder" alter column "isInboxFromOtherScope" drop default');
    }

    async down(): Promise<void> {
        throw new Error("No revert");
    }
}
