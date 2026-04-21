import { Migration } from '@mikro-orm/migrations';

export class Migration20260413095032 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "Manufacturer" add column "full_text" tsvector null;`);
    this.addSql(`create index "Manufacturer_full_text_index" on "public"."Manufacturer" using gin("full_text");`);

    this.addSql(`alter table "News" add column "full_text" tsvector null;`);
    this.addSql(`create index "News_full_text_index" on "public"."News" using gin("full_text");`);

    this.addSql(`alter table "Product" add column "full_text" tsvector null;`);
    this.addSql(`create index "Product_full_text_index" on "public"."Product" using gin("full_text");`);
  }

  override async down(): Promise<void> {
  }

}
