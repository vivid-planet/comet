import { Migration } from "@mikro-orm/migrations";

export class Migration20220127092750 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "Page" ("id" uuid not null, "content" json not null, "seo" json not null, "createdAt" timestamp with time zone not null, "updatedAt" timestamp with time zone not null);',
        );
        this.addSql('alter table "Page" add constraint "Page_pkey" primary key ("id");');
    }
}
