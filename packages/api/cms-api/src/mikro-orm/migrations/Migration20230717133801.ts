import { Migration } from '@mikro-orm/migrations';

export class Migration20230717133801 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "DamFile" add column "copyOf" uuid null;');
    this.addSql('alter table "DamFolder" add column "isImportFolder" boolean not null default false;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "DamFile" drop column "copyOf";');
    this.addSql('alter table "DamFolder" drop column "isImportFolder";');
  }

}
