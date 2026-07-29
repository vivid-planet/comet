import { Migration } from "@mikro-orm/migrations";

export class Migration20260729132511 extends Migration {
    override async up(): Promise<void> {
        this.addSql(
            'create table "SiteSettings" ("id" uuid not null, "organizationName" text not null, "organizationUrl" text null, "organizationLogo" json not null, "organizationSameAs" text[] not null, "organizationDescription" text null, "scope_domain" text not null, "scope_language" text not null, "createdAt" timestamp with time zone not null, "updatedAt" timestamp with time zone not null, constraint "SiteSettings_pkey" primary key ("id"));',
        );
    }

    override async down(): Promise<void> {
        this.addSql('drop table if exists "SiteSettings";');
    }
}
