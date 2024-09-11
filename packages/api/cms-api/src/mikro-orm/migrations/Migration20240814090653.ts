import { Migration } from "@mikro-orm/migrations";

export class Migration20240814090653 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "PageTreeNode" alter column "hideInMenu" type boolean using ("hideInMenu"::boolean);');
        this.addSql('alter table "PageTreeNode" alter column "hideInMenu" set default false;');
    }
}
