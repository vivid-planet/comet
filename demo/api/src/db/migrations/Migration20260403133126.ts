import { Migration } from '@mikro-orm/migrations';

export class Migration20260403133126 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "Page" add column "searchableContent" tsvector null;`);
    this.addSql(`create index "Page_searchableContent_index" on "public"."Page" using gin("searchableContent");`);
    this.addSql(`alter table "Page" add column "searchableSeo" tsvector null;`);
    this.addSql(`create index "Page_searchableSeo_index" on "public"."Page" using gin("searchableSeo");`);
    this.addSql(`alter table "Page" add column "searchableStage" tsvector null;`);
    this.addSql(`create index "Page_searchableStage_index" on "public"."Page" using gin("searchableStage");`);
  }

  override async down(): Promise<void> {
  }

}
