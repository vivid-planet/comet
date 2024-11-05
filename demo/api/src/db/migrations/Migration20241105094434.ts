import { Migration } from '@mikro-orm/migrations';

export class Migration20241105094434 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "Warning" ("id" uuid not null, "createdAt" timestamptz(0) not null, "updatedAt" timestamptz(0) not null, "uniqueIdentifier" text not null, "message" text not null, "type" varchar(255) not null, "severity" text check ("severity" in (\'critical\', \'high\', \'low\')) not null, "status" text check ("status" in (\'open\', \'resolved\', \'ignored\')) not null default \'open\', constraint "Warning_pkey" primary key ("id"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table "Warning";');
  }

}
