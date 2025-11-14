import { Migration } from '@mikro-orm/migrations';

export class Migration20240528173751 extends Migration {

  async up(): Promise<void> {

    this.addSql('delete from "ProductVariant";');
    this.addSql('delete from "Product";');
    this.addSql('alter table "Product" add column "additionalTypes" text[] not null;');
  }

  async down(): Promise<void> {

  }

}
