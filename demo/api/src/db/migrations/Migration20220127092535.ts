import { Migration } from "@mikro-orm/migrations";

export class Migration20220127092535 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'alter table "PageTreeNode" add column "scope_domain" text not null, add column "scope_language" text not null, add column "parent" uuid null, add column "category" text check ("category" in (\'main-navigation\')) not null default \'main-navigation\';',
        );
        this.addSql('create index "PageTreeNode_parent_index" on "PageTreeNode" ("parent");');
        this.addSql(
            'alter table "PageTreeNode" add constraint "PageTreeNode_parent_foreign" foreign key ("parent") references "PageTreeNode" ("id") on update cascade on delete set null;',
        );
    }
}
