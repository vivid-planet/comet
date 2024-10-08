import { Migration } from '@mikro-orm/migrations';

export class Migration20241008102605 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "Warning" ("id" uuid not null, "createdAt" timestamptz(0) not null, "updatedAt" timestamptz(0) not null, "type" varchar(255) not null, "severity" text check ("severity" in (\'critical\', \'high\', \'low\')) not null, "status" text check ("status" in (\'open\', \'resolved\', \'ignored\')) not null, constraint "Warning_pkey" primary key ("id"));');
  }

}
