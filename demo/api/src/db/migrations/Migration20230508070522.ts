import { Migration } from '@mikro-orm/migrations';

export class Migration20230508070522 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "ProductTag" ("id" uuid not null, "title" varchar(255) not null, "createdAt" timestamptz(0) not null, "updatedAt" timestamptz(0) not null, constraint "ProductTag_pkey" primary key ("id"));');

    this.addSql('create table "Product_tags" ("product" uuid not null, "productTag" uuid not null, constraint "Product_tags_pkey" primary key ("product", "productTag"));');

    this.addSql('alter table "Product_tags" add constraint "Product_tags_product_foreign" foreign key ("product") references "Product" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "Product_tags" add constraint "Product_tags_productTag_foreign" foreign key ("productTag") references "ProductTag" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "Product_tags" drop constraint "Product_tags_productTag_foreign";');
    this.addSql('drop table if exists "ProductTag" cascade;');
    this.addSql('drop table if exists "Product_tags" cascade;');
  }

}
