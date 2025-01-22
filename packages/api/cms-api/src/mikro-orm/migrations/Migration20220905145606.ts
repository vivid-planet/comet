import { Migration } from "@mikro-orm/migrations";

export class Migration20220905145606 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'alter table "DamFile" add column "license_type" text check ("license_type" in (\'ROYALTY_FREE\', \'RIGHTS_MANAGED\', \'SUBSCRIPTION\', \'MICRO\')) null, add column "license_details" text null, add column "license_author" text null, add column "license_durationFrom" timestamp with time zone null, add column "license_durationTo" timestamp with time zone null;',
        );
    }

    async down(): Promise<void> {
        this.addSql('alter table "DamFile" drop column "license_type";');
        this.addSql('alter table "DamFile" drop column "license_details";');
        this.addSql('alter table "DamFile" drop column "license_author";');
        this.addSql('alter table "DamFile" drop column "license_durationFrom";');
        this.addSql('alter table "DamFile" drop column "license_durationTo";');
    }
}
