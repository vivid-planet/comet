import { Migration } from '@mikro-orm/migrations';

export class Migration20240725161414 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "Warning" ("id" uuid not null, "createdAt" timestamptz(0) not null, "updatedAt" timestamptz(0) not null, "type" varchar(255) not null, "level" text check ("level" in (\'critical\', \'high\', \'low\')) not null, "state" text check ("state" in (\'open\', \'resolved\', \'ignored\')) not null, constraint "Warning_pkey" primary key ("id"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "Warning" cascade;');
  }

}
