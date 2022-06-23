import { Migration } from "@mikro-orm/migrations";

export class Migration20220127085946 extends Migration {
    async up(): Promise<void> {
        this.addSql('create table "ChangesSinceLastBuild" ("id" uuid not null, "createdAt" timestamp with time zone not null);');
        this.addSql('alter table "ChangesSinceLastBuild" add constraint "ChangesSinceLastBuild_pkey" primary key ("id");');
    }
}
