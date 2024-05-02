import { Migration } from '@mikro-orm/migrations';

export class Migration20240419135211 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "ProductToTag" ("id" uuid not null, "product" uuid not null, "tag" uuid not null, "exampleStatus" boolean not null default true, constraint "ProductToTags_pkey" primary key ("id"));');

    this.addSql('alter table "ProductToTag" add constraint "ProductToTag_product_foreign" foreign key ("product") references "Product" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "ProductToTag" add constraint "ProductToTag_tag_foreign" foreign key ("tag") references "ProductTag" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "ProductToTag" cascade;');
  }

}
