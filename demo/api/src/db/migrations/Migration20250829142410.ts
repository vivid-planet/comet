import { Migration } from '@mikro-orm/migrations';

export class Migration20250829142410 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "ProductHighlight" ("id" uuid not null, "description" text not null, "product" uuid not null, "createdAt" timestamptz not null, "updatedAt" timestamptz not null, constraint "ProductHighlight_pkey" primary key ("id"));`);
    this.addSql(`alter table "ProductHighlight" add constraint "ProductHighlight_product_foreign" foreign key ("product") references "Product" ("id") on update cascade;`);
  }
}
