import { Migration } from "@mikro-orm/migrations";

export class Migration20260128114300 extends Migration {
    override async up(): Promise<void> {
        this.addSql(
            `create table "NavigationCallToActionButtonList" ("id" uuid not null, "content" json not null, "scope_domain" text not null, "scope_language" text not null, "createdAt" timestamptz not null, "updatedAt" timestamptz not null, constraint "NavigationCallToActionButtonList_pkey" primary key ("id"));`,
        );
    }
}
