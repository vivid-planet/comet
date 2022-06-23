import { Migration } from "@mikro-orm/migrations";

export class Migration20220127091751 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "PageTreeNodeDocument" ("id" uuid not null, "pageTreeNodeId" uuid not null, "type" text not null, "documentId" uuid not null);',
        );
        this.addSql('alter table "PageTreeNodeDocument" add constraint "PageTreeNodeDocument_pkey" primary key ("id");');
        this.addSql('create index "PageTreeNodeDocument_pageTreeNodeId_index" on "PageTreeNodeDocument" ("pageTreeNodeId");');
        this.addSql('create index "PageTreeNodeDocument_documentId_index" on "PageTreeNodeDocument" ("documentId");');
        this.addSql(
            'alter table "PageTreeNodeDocument" add constraint "PageTreeNodeDocument_pageTreeNodeId_documentId_unique" unique ("pageTreeNodeId", "documentId");',
        );
    }
}
