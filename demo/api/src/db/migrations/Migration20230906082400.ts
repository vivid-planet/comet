import { Migration } from '@mikro-orm/migrations';

export class Migration20230906082400 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "ShopProductCategory" ("id" uuid not null, "name" varchar(255) not null, "description" varchar(255) not null, constraint "ShopProductCategory_pkey" primary key ("id"));');

    this.addSql('create table "ShopProduct" ("id" uuid not null, "name" varchar(255) not null, "description" varchar(255) not null, "category" uuid not null, constraint "ShopProduct_pkey" primary key ("id"));');

    this.addSql('create table "ShopProductVariant" ("id" uuid not null, "product" uuid not null, "size" varchar(255) not null, "color" varchar(255) not null, "price" int not null, constraint "ShopProductVariant_pkey" primary key ("id"));');

    this.addSql('alter table "ShopProduct" add constraint "ShopProduct_category_foreign" foreign key ("category") references "ShopProductCategory" ("id") on update cascade;');

    this.addSql('alter table "ShopProductVariant" add constraint "ShopProductVariant_product_foreign" foreign key ("product") references "ShopProduct" ("id") on update cascade;');
  }

}
