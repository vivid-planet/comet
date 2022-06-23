import { Migration } from "@mikro-orm/migrations";

export class Migration20220127085859 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "Redirect" ("id" uuid not null, "sourceType" text check ("sourceType" in (\'path\')) not null, "source" text not null, "targetType" text check ("targetType" in (\'intern\', \'extern\')) not null, "targetUrl" text null, "targetPageId" uuid null, "comment" text null, "active" bool not null default true, "generationType" text check ("generationType" in (\'manual\', \'automatic\')) not null, "createdAt" timestamp with time zone not null, "updatedAt" timestamp with time zone not null);',
        );
        this.addSql('alter table "Redirect" add constraint "Redirect_pkey" primary key ("id");');
    }
}
