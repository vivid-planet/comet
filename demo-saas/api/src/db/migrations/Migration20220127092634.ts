import { Migration } from "@mikro-orm/migrations";

export class Migration20220127092634 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "MainMenuItem" ("id" uuid not null, "nodeId" uuid not null, "content" json null, "createdAt" timestamp with time zone not null, "updatedAt" timestamp with time zone not null);',
        );
        this.addSql('alter table "MainMenuItem" add constraint "MainMenuItem_pkey" primary key ("id");');
        this.addSql('alter table "MainMenuItem" add constraint "MainMenuItem_nodeId_unique" unique ("nodeId");');
        this.addSql(
            'alter table "MainMenuItem" add constraint "MainMenuItem_nodeId_foreign" foreign key ("nodeId") references "PageTreeNode" ("id") on update cascade on delete CASCADE;',
        );
    }
}
