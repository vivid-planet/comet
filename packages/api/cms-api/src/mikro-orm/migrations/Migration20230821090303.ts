import { Migration } from "@mikro-orm/migrations";

export class Migration20230821090303 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "DamFile" add column "copyOfId" uuid null;');
        this.addSql(
            'alter table "DamFile" add constraint "DamFile_copyOfId_foreign" foreign key ("copyOfId") references "DamFile" ("id") on update cascade on delete set null;',
        );
        this.addSql('alter table "DamFolder" add column "isInboxFromOtherScope" boolean not null default false;');
    }

    async down(): Promise<void> {
        this.addSql('alter table "DamFile" drop constraint "DamFile_copyOfId_foreign";');
        this.addSql('alter table "DamFile" drop column "copyOfId";');
        this.addSql('alter table "DamFolder" drop column "isInboxFromOtherScope";');
    }
}
