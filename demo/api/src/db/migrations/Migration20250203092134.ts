import { Migration } from "@mikro-orm/migrations";

export class Migration20250203092134 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "RawProduct" ("id" uuid not null, "deletedAt" timestamp with time zone null, "title" varchar(255) not null, "status" text check ("status" in (\'Published\', \'Unpublished\', \'Deleted\')) not null default \'Unpublished\', "slug" varchar(255) not null, "description" varchar(255) not null, "type" text check ("type" in (\'Cap\', \'Shirt\', \'Tie\')) not null, "additionalTypes" text[] not null, "price" numeric(10,0) null, "priceRange" jsonb null, "inStock" boolean not null default true, "soldCount" int null, "availableSince" date null, "lastCheckedAt" timestamptz(0) null, "image" varchar(255) not null, "discounts" text[] not null, "articleNumbers" text[] not null, "category" varchar(255) not null, "dimensions" jsonb null, "colors" text[] not null, "createdAt" timestamptz(0) not null, "updatedAt" timestamptz(0) not null, "manufacturer" uuid null, constraint "RawProduct_pkey" primary key ("id"));',
        );
        this.addSql('create index "RawProduct_manufacturer_index" on "RawProduct" ("manufacturer");');

        this.addSql(
            'alter table "RawProduct" add constraint "RawProduct_manufacturer_foreign" foreign key ("manufacturer") references "Manufacturer" ("id") on update cascade on delete set null;',
        );
    }
}
