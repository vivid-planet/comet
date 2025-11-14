import { Migration } from "@mikro-orm/migrations";

export class Migration20220223131155 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "PageTreeNode" drop constraint "PageTreeNode_parent_foreign";');
        this.addSql('drop index "PageTreeNode_parent_index";');
        this.addSql('alter table "PageTreeNode" drop column "parent";');

        this.addSql('create index "PageTreeNode_parentId_index" on "PageTreeNode" ("parentId");');
        this.addSql(
            'alter table "PageTreeNode" add constraint "PageTreeNode_parentId_foreign" foreign key ("parentId") references "PageTreeNode" ("id") on update cascade on delete set null;',
        );
    }
}
