import { Migration } from "@mikro-orm/migrations";

export class Migration20220127085720 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "News" ("id" uuid not null, "title" varchar(255) not null, "slug" varchar(255) not null, "createdAt" timestamptz(0) not null, "updatedAt" timestamptz(0) not null);',
        );
        this.addSql('alter table "News" add constraint "News_pkey" primary key ("id");');
    }
}
