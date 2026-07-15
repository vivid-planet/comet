import { Migration } from "@mikro-orm/migrations";

export class Migration20260102122632 extends Migration {
    override async up(): Promise<void> {
        this.addSql(`alter table "BrevoConfig" add column "scope_domain" text not null, add column "scope_language" text not null;`);
        this.addSql(`alter table "BrevoBlacklistedContacts" add column "scope_domain" text not null, add column "scope_language" text not null;`);
        this.addSql(`alter table "BrevoEmailCampaign" add column "scope_domain" text not null, add column "scope_language" text not null;`);
        this.addSql(`alter table "BrevoEmailImportLog" add column "scope_domain" text not null, add column "scope_language" text not null;`);
        this.addSql(
            `alter table "BrevoTargetGroup" add column "scope_domain" text not null, add column "scope_language" text not null, add column "filters_SALUTATION" text[] null, add column "filters_BRANCH" text[] null;`,
        );
    }
}
