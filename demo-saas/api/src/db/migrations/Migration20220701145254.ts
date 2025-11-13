import { Migration } from '@mikro-orm/migrations';

export class Migration20220701145254 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "PredefinedPage" ("id" uuid not null, "createdAt" timestamp with time zone not null, "updatedAt" timestamp with time zone not null, "type" text null);');
    this.addSql('alter table "PredefinedPage" add constraint "PredefinedPage_pkey" primary key ("id");');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "PredefinedPage" cascade;');
  }

}
