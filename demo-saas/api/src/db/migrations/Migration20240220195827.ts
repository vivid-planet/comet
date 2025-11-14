import { Migration } from '@mikro-orm/migrations';

export class Migration20240220195827 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "Manufacturer" ("id" uuid not null, "address" jsonb null, "addressAsEmbeddable_street" varchar(255) null, "addressAsEmbeddable_zip" int null, "addressAsEmbeddable_country" varchar(255) null, "addressAsEmbeddable_alternativeAddress_street" varchar(255) null, "addressAsEmbeddable_alternativeAddress_zip" int null, "addressAsEmbeddable_alternativeAddress_country" varchar(255) null, constraint "Manufacturer_pkey" primary key ("id"));');
    this.addSql('alter table "Manufacturer" add column "addressAsEmbeddable_streetNumber" int null, add column "addressAsEmbeddable_alternativeAddress_streetNumber" int null;');
    this.addSql('alter table "Manufacturer" add column "updatedAt" timestamptz(0) not null;');
  }
}
