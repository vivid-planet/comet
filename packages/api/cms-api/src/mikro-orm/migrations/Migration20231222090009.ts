import { Migration } from "@mikro-orm/migrations";

export class Migration20231222090009 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "DamFile" drop constraint if exists "DamFile_license_type_check";');
        this.addSql(
            'update "DamFile" set "license_type" = \'RIGHTS_MANAGED\' where "license_type" = \'MICRO\' or "license_type" = \'SUBSCRIPTION\';',
        );
        this.addSql(
            'alter table "DamFile" add constraint "DamFile_license_type_check" check ("license_type" in (\'ROYALTY_FREE\', \'RIGHTS_MANAGED\'));',
        );
    }

    async down(): Promise<void> {
        this.addSql('alter table "DamFile" drop constraint if exists "DamFile_license_type_check";');
        this.addSql(
            "alter table \"DamFile\" add constraint \"DamFile_license_type_check\" check (\"license_type\" in ('ROYALTY_FREE', 'RIGHTS_MANAGED', 'SUBSCRIPTION', 'MICRO'));",
        );
    }
}
