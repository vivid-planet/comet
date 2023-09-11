import { Migration } from '@mikro-orm/migrations';

export class Migration20230911105054 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "ShopProduct" ("id" uuid not null, "name" varchar(255) not null, "description" varchar(255) not null, constraint "ShopProduct_pkey" primary key ("id"));');

    this.addSql('create table "ShopProductCategory" ("id" uuid not null, "name" varchar(255) not null, "description" varchar(255) not null, constraint "ShopProductCategory_pkey" primary key ("id"));');

    this.addSql('create table "ShopProduct_category" ("shopProduct" uuid not null, "shopProductCategory" uuid not null, constraint "ShopProduct_category_pkey" primary key ("shopProduct", "shopProductCategory"));');

    this.addSql('create table "ShopProductVariant" ("id" uuid not null, "product" uuid not null, "name" varchar(255) not null, "size" varchar(255) not null, "color" varchar(255) not null, "price" int not null, constraint "ShopProductVariant_pkey" primary key ("id"));');

    this.addSql('alter table "ShopProduct_category" add constraint "ShopProduct_category_shopProduct_foreign" foreign key ("shopProduct") references "ShopProduct" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "ShopProduct_category" add constraint "ShopProduct_category_shopProductCategory_foreign" foreign key ("shopProductCategory") references "ShopProductCategory" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "ShopProductVariant" add constraint "ShopProductVariant_product_foreign" foreign key ("product") references "ShopProduct" ("id") on update cascade;');
  }

}
