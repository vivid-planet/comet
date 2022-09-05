import { Migration } from '@mikro-orm/migrations';

export class Migration20220905110859 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "DamFile" add column "license_type" varchar(255) not null default \'royalty_free\', add column "license_details" text null, add column "license_author" text null, add column "license_durationFrom" timestamp with time zone null, add column "license_durationTo" timestamp with time zone null;');
    this.addSql('ALTER TABLE "DamFile" ALTER COLUMN "license_type" DROP DEFAULT;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "DamFile" drop column "license_type";');
    this.addSql('alter table "DamFile" drop column "license_details";');
    this.addSql('alter table "DamFile" drop column "license_author";');
    this.addSql('alter table "DamFile" drop column "license_durationFrom";');
    this.addSql('alter table "DamFile" drop column "license_durationTo";');
  }

}
