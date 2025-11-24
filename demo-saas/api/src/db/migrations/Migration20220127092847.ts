import { Migration } from "@mikro-orm/migrations";

export class Migration20220127092847 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "Link" ("id" uuid not null, "content" json not null, "createdAt" timestamp with time zone not null, "updatedAt" timestamp with time zone not null);',
        );
        this.addSql('alter table "Link" add constraint "Link_pkey" primary key ("id");');
    }
}
