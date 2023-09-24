import { Migration } from "@mikro-orm/migrations";

export class Migration20230924152247 extends Migration {
  async up(): Promise<void> {
    this.addSql(
        'create table "Book" ("id" uuid not null, "title" varchar(255) not null, "description" varchar(255) not null, "isAvailable" boolean not null, "releaseDate" timestamptz(0) not null, "price" numeric(10,2) not null, "publisher" text check ("publisher" in (\'Piper\', \'Ullstein\', \'Manhattan Verlag\')) not null, "coverImage" json not null, "link" json not null, "createdAt" timestamp with time zone not null, "updatedAt" timestamp with time zone not null, constraint "Book_pkey" primary key ("id"));',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "Book" cascade;');
  }
}
