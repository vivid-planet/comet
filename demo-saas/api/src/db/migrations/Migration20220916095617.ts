import { Migration } from "@mikro-orm/migrations";

export class Migration20220916095617 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "NewsComment" ("id" uuid not null, "news" uuid not null, "comment" varchar(255) not null, "createdAt" timestamp with time zone not null, "updatedAt" timestamp with time zone not null);',
        );
        this.addSql('alter table "NewsComment" add constraint "NewsComment_pkey" primary key ("id");');

        this.addSql(
            'alter table "NewsComment" add constraint "NewsComment_news_foreign" foreign key ("news") references "News" ("id") on update cascade;',
        );
    }

    async down(): Promise<void> {
        this.addSql('drop table if exists "NewsComment" cascade;');
    }
}
