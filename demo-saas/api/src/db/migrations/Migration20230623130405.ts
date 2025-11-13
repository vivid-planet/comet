import { Migration } from '@mikro-orm/migrations';

export class Migration20230623130405 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "ProductVariant" ("id" uuid not null, "name" varchar(255) not null, "product" uuid not null, "createdAt" timestamptz(0) not null, "updatedAt" timestamptz(0) not null, constraint "ProductVariant_pkey" primary key ("id"));');
    this.addSql('alter table "ProductVariant" add constraint "ProductVariant_product_foreign" foreign key ("product") references "Product" ("id") on update cascade;');
  }

  async down(): Promise<void> {
  }

}
