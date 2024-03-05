import { Migration } from '@mikro-orm/migrations';

export class Migration20231204165948 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "ProductColor" ("id" uuid not null, "name" varchar(255) not null, "hexCode" varchar(255) not null, "product" uuid not null, "createdAt" timestamptz(0) not null, "updatedAt" timestamptz(0) not null, constraint "ProductColor_pkey" primary key ("id"));');

    this.addSql('alter table "ProductColor" add constraint "ProductColor_product_foreign" foreign key ("product") references "Product" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "ProductColor" cascade;');
  }

}
