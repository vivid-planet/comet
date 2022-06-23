import { Migration } from "@mikro-orm/migrations";

export class Migration20220127091538 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "PageTreeNode" ("id" uuid not null, "parentId" uuid null, "pos" int4 not null, "name" text not null, "slug" text not null, "visibility" text check ("visibility" in (\'Published\', \'Unpublished\', \'Archived\')) not null default \'Unpublished\', "documentType" text not null, "hideInMenu" bool not null default false);',
        );
        this.addSql('alter table "PageTreeNode" add constraint "PageTreeNode_pkey" primary key ("id");');
    }
}
