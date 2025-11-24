import { Migration } from "@mikro-orm/migrations";

export class Migration20220927110236 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "Product" ("id" uuid not null, "title" varchar(255) not null, "slug" varchar(255) not null, "description" text not null, "price" numeric(10,0) null, "createdAt" timestamp with time zone not null, "updatedAt" timestamp with time zone not null, constraint "Product_pkey" primary key ("id"));',
        );
    }

    async down(): Promise<void> {
        this.addSql('drop table if exists "Product" cascade;');
    }
}
