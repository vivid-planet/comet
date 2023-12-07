import { Migration } from '@mikro-orm/migrations';

export class Migration20231206112427 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "Page" add column "lastUpdatedUserLabel" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "Page" drop column "lastUpdatedUserLabel";');
  }

}
