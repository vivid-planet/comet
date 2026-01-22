import { Migration } from "@mikro-orm/migrations";

export class Migration20240819214939 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "EmailCampaign" drop constraint "EmailCampaign_targetGroup_foreign";');

        this.addSql(
            'create table "EmailCampaign_targetGroups" ("emailCampaign" uuid not null, "targetGroup" uuid not null, constraint "EmailCampaign_targetGroups_pkey" primary key ("emailCampaign", "targetGroup"));',
        );

        this.addSql(
            'alter table "EmailCampaign_targetGroups" add constraint "EmailCampaign_targetGroups_emailCampaign_foreign" foreign key ("emailCampaign") references "EmailCampaign" ("id") on update cascade on delete cascade;',
        );
        this.addSql(
            'alter table "EmailCampaign_targetGroups" add constraint "EmailCampaign_targetGroups_targetGroup_foreign" foreign key ("targetGroup") references "TargetGroup" ("id") on update cascade on delete cascade;',
        );

        this.addSql(`
          INSERT INTO "EmailCampaign_targetGroups" ("emailCampaign", "targetGroup") 
          SELECT "id", "targetGroup" FROM "EmailCampaign" WHERE "targetGroup" IS NOT NULL;
        `);

        this.addSql('alter table "EmailCampaign" drop column "targetGroup";');
    }
}
