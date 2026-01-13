import { Migration } from "@mikro-orm/migrations";

export class Migration20240123145606 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "EmailCampaign" add column "targetGroup" uuid null');
        this.addSql('alter table "EmailCampaign" drop column "contactList";');

        this.addSql(
            'alter table "EmailCampaign" add constraint "EmailCampaign_targetGroup_foreign" foreign key ("targetGroup") references "TargetGroup" ("id") on update cascade on delete set null;',
        );
    }
}
