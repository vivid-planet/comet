import { Migration } from "@mikro-orm/migrations";

export class Migration20250703155205 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "EmailCampaign" rename to "BrevoEmailCampaign";');
        this.addSql('alter table "BlacklistedContacts" rename to "BrevoBlacklistedContacts";');
        this.addSql('alter table "TargetGroup" rename to "BrevoTargetGroup";');
        this.addSql('alter table "EmailCampaign_targetGroups" rename to "BrevoEmailCampaign_targetGroups";');
        this.addSql('alter table "BrevoEmailCampaign_targetGroups" rename column "emailCampaign" to "brevoEmailCampaign";');
        this.addSql('alter table "BrevoEmailCampaign_targetGroups" rename column "targetGroup" to "brevoTargetGroup";');
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
