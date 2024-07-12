import { Migration } from "@mikro-orm/migrations";

export class Migration20240624092349 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "Product_datasheets" ("product" uuid not null, "publicUpload" uuid not null, constraint "Product_datasheets_pkey" primary key ("product", "publicUpload"));',
        );
        this.addSql(
            'alter table "Product_datasheets" add constraint "Product_datasheets_product_foreign" foreign key ("product") references "Product" ("id") on update cascade on delete cascade;',
        );
        this.addSql(
            'alter table "Product_datasheets" add constraint "Product_datasheets_publicUpload_foreign" foreign key ("publicUpload") references "PublicUpload" ("id") on update cascade on delete cascade;',
        );

        this.addSql('alter table "Product" add column "priceList" uuid null;');
        this.addSql(
            'alter table "Product" add constraint "Product_priceList_foreign" foreign key ("priceList") references "PublicUpload" ("id") on update cascade on delete set null;',
        );
    }

    async down(): Promise<void> {
        this.addSql('drop table if exists "Product_datasheets" cascade;');

        this.addSql('alter table "Product" drop constraint "Product_priceList_foreign";');
        this.addSql('alter table "Product" drop column "priceList";');
    }
}
