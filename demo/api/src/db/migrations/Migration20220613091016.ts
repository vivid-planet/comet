import { Migration } from '@mikro-orm/migrations';

export class Migration20220613091016 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "Footer" ("id" uuid not null, "content" json not null, "scope_domain" text not null, "scope_language" text not null, "createdAt" timestamp with time zone not null, "updatedAt" timestamp with time zone not null);');
    this.addSql('alter table "Footer" add constraint "Footer_pkey" primary key ("id");');

    this.addSql('alter table "News" add column "scope_domain" text not null, add column "scope_language" text not null, add column "date" timestamptz(0) not null, add column "category" text check ("category" in (\'Events\', \'Company\', \'Awards\')) not null, add column "visible" boolean not null default false, add column "image" json not null, add column "content" json not null;');
    this.addSql('alter table "News" drop constraint if exists "News_createdAt_check";');
    this.addSql('alter table "News" alter column "createdAt" type timestamp with time zone using ("createdAt"::timestamp with time zone);');
    this.addSql('alter table "News" drop constraint if exists "News_updatedAt_check";');
    this.addSql('alter table "News" alter column "updatedAt" type timestamp with time zone using ("updatedAt"::timestamp with time zone);');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "Footer" cascade;');

    this.addSql('alter table "News" drop constraint if exists "News_createdAt_check";');
    this.addSql('alter table "News" alter column "createdAt" type timestamptz using ("createdAt"::timestamptz);');
    this.addSql('alter table "News" drop constraint if exists "News_updatedAt_check";');
    this.addSql('alter table "News" alter column "updatedAt" type timestamptz using ("updatedAt"::timestamptz);');
    this.addSql('alter table "News" drop column "scope_domain";');
    this.addSql('alter table "News" drop column "scope_language";');
    this.addSql('alter table "News" drop column "date";');
    this.addSql('alter table "News" drop column "category";');
    this.addSql('alter table "News" drop column "visible";');
    this.addSql('alter table "News" drop column "image";');
    this.addSql('alter table "News" drop column "content";');
  }

}