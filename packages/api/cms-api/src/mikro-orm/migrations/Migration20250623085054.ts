import { Migration } from '@mikro-orm/migrations';

export class Migration20250623085054 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`
      create table "Warning" (
        "id" uuid not null,
        "createdAt" timestamp with time zone not null,
        "updatedAt" timestamp with time zone not null,
        "message" text not null,
        "severity" text check ("severity" in ('high', 'medium', 'low')) not null,
        "status" text check ("status" in ('open', 'resolved', 'ignored')) not null default 'open',
        "sourceInfo" jsonb not null,
        "scope" jsonb null,
        constraint "Warning_pkey" primary key ("id")
      );
    `);
  }
}
