import { Migration } from "@mikro-orm/migrations";

export class Migration20260323121622 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "BrevoEmailCampaign" drop constraint if exists "EmailCampaign_sendingState_check";');
        this.addSql(
            "alter table \"BrevoEmailCampaign\" add constraint \"BrevoEmailCampaign_sendingState_check\" check (\"sendingState\" in ('DRAFT', 'SENT', 'SCHEDULED', 'FAILED'));",
        );
    }
}
