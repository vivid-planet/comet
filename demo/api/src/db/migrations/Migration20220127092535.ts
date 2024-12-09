import { Migration } from "@mikro-orm/migrations";

export class Migration20220127092535 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'alter table "PageTreeNode" add column "scope_domain" text not null, add column "scope_language" text not null, add column "category" text check ("category" in (\'MainNavigation\')) not null default \'MainNavigation\';',
        );
        this.addSql(
            'alter table "PageTreeNode" add constraint "PageTreeNode_parentId_foreign" foreign key ("parentId") references "PageTreeNode" ("id") on update cascade on delete set null;',
        );
        this.addSql('create index "PageTreeNode_parentId_index" on "PageTreeNode" ("parentId");');
    }
}
