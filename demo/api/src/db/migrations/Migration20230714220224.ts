import { Migration } from '@mikro-orm/migrations';

export class Migration20230714220224 extends Migration {

  async up(): Promise<void> {
    this.addSql('truncate table "ProductVariant";');
    this.addSql('alter table "ProductVariant" add column "image" json not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "ProductVariant" drop column "image";');
  }

}
