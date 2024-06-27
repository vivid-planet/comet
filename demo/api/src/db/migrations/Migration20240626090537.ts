import { Migration } from '@mikro-orm/migrations';

export class Migration20240626090537 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "Manufacturer" add column "foundationDate" date not null default CURRENT_DATE;');
    this.addSql('alter table "Manufacturer" alter column "foundationDate" drop default;');
  }

}
