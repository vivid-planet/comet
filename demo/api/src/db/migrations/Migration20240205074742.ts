import { Migration } from '@mikro-orm/migrations';

export class Migration20240205074742 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "Product" add column "availableSince" date null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "Product" drop column "availableSince";');
  }
}
