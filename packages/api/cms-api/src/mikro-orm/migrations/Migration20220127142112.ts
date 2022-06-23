import { Migration } from "@mikro-orm/migrations";

export class Migration20220127142112 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "PublicUpload" ("id" uuid not null, "name" text not null, "size" bigint not null, "mimetype" text not null, "contentHash" character(32) not null, "createdAt" timestamp with time zone not null, "updatedAt" timestamp with time zone not null);',
        );
        this.addSql('alter table "PublicUpload" add constraint "PublicUpload_pkey" primary key ("id");');
        this.addSql('create index "PublicUpload_contentHash_index" on "PublicUpload" ("contentHash");');
    }
}
