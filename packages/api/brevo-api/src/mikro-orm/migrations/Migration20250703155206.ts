import { Migration } from "@mikro-orm/migrations";

export class Migration20250703155206 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'alter table "BrevoEmailCampaign_targetGroups" rename constraint "EmailCampaign_targetGroups_pkey" to "BrevoEmailCampaign_targetGroups_pkey";',
        );
        this.addSql(
            'alter table "BrevoEmailCampaign_targetGroups" rename constraint "EmailCampaign_targetGroups_emailCampaign_foreign" to "BrevoEmailCampaign_targetGroups_brevoEmailCampaign_foreign";',
        );
        this.addSql(
            'alter table "BrevoEmailCampaign_targetGroups" rename constraint "EmailCampaign_targetGroups_targetGroup_foreign" to "BrevoEmailCampaign_targetGroups_brevoTargetGroup_foreign";',
        );
    }
}
