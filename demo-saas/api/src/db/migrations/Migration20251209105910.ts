import { Migration } from '@mikro-orm/migrations';

export class Migration20251209105910 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "Product" alter column "image" drop default;`);
    this.addSql(`alter table "Product" alter column "image" type uuid using ("image"::text::uuid);`);
    this.addSql(`alter table "Product" alter column "image" drop not null;`);
    this.addSql(`alter table "Product" add constraint "Product_image_foreign" foreign key ("image") references "CometFileUpload" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "ProductVariant" alter column "image" drop default;`);
    this.addSql(`alter table "ProductVariant" alter column "image" type uuid using ("image"::text::uuid);`);
    this.addSql(`alter table "ProductVariant" alter column "image" drop not null;`);
    this.addSql(`alter table "ProductVariant" add constraint "ProductVariant_image_foreign" foreign key ("image") references "CometFileUpload" ("id") on update cascade on delete set null;`);
  }

}
