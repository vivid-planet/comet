import { Migration } from "@mikro-orm/migrations";

export class Migration20240621102349 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            "alter table \"EmailCampaign\" add column \"sendingState\" text check (\"sendingState\" in ('DRAFT', 'SENT', 'SCHEDULED')) null;",
        );

        // sending state will be set to SENT the first when the campaign is requested for already sent campaigns
        this.addSql(`
            UPDATE "EmailCampaign" 
            SET "sendingState" = CASE
                WHEN "scheduledAt" IS NOT NULL THEN 'SCHEDULED' 
                ELSE 'DRAFT'
            END;
        `);

        this.addSql('alter table "EmailCampaign" alter column "sendingState" set not null;');
    }
}
