import { Migration } from "@mikro-orm/migrations";

export class Migration20240118144808 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "TargetGroup" ("id" uuid not null, "createdAt" timestamp with time zone not null, "updatedAt" timestamp with time zone not null, "title" text not null, "brevoId" int not null, "isMainList" boolean);',
        );
        this.addSql('alter table "TargetGroup" add constraint "TargetGroup_pkey" primary key ("id");');
    }
}
