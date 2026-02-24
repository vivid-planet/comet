import { Migration } from "@mikro-orm/migrations";

export class Migration20260215000000 extends Migration {
    async up(): Promise<void> {
        this.addSql(`alter table "News" alter column "category" drop default;`);

        this.addSql(`update "PageTreeNode" set "userGroup" = 'editor' where "userGroup" = 'user';`);
        this.addSql(`alter table "PageTreeNode" drop constraint if exists "PageTreeNode_userGroup_check";`);
        this.addSql(`alter table "PageTreeNode" add constraint "PageTreeNode_userGroup_check" check ("userGroup" in ('all', 'admin', 'editor'));`);
    }
}
