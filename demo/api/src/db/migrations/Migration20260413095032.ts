import { Migration } from '@mikro-orm/migrations';

export class Migration20260413095032 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "Manufacturer" add column "searchable" tsvector null;`);
    this.addSql(`create index "Manufacturer_searchable_index" on "public"."Manufacturer" using gin("searchable");`);

    this.addSql(`alter table "News" add column "searchable" tsvector null;`);
    this.addSql(`create index "News_searchable_index" on "public"."News" using gin("searchable");`);

    this.addSql(`alter table "Product" add column "searchable" tsvector null;`);
    this.addSql(`create index "Product_searchable_index" on "public"."Product" using gin("searchable");`);
  }

  override async down(): Promise<void> {
  }

}
