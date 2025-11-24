import { Migration } from '@mikro-orm/migrations';

export class Migration20230329084758 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "ProductCategory" ("id" uuid not null, "title" varchar(255) not null, "slug" varchar(255) not null, "createdAt" timestamptz(0) not null, "updatedAt" timestamptz(0) not null, constraint "ProductCategory_pkey" primary key ("id"));');
    this.addSql('alter table "Product" add column "category" uuid null;');
    this.addSql('alter table "Product" add constraint "Product_category_foreign" foreign key ("category") references "ProductCategory" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "Product" drop constraint "Product_category_foreign";');
    this.addSql('drop table if exists "ProductCategory" cascade;');
    this.addSql('alter table "Product" drop column "category";');
  }

}
