import { Migration } from "@mikro-orm/migrations";

export class Migration20240729104840 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "Product_datasheets" ("product" uuid not null, "fileUpload" uuid not null, constraint "Product_datasheets_pkey" primary key ("product", "fileUpload"));',
        );
        this.addSql(
            'alter table "Product_datasheets" add constraint "Product_datasheets_product_foreign" foreign key ("product") references "Product" ("id") on update cascade on delete cascade;',
        );
        this.addSql(
            'alter table "Product_datasheets" add constraint "Product_datasheets_fileUpload_foreign" foreign key ("fileUpload") references "CometFileUpload" ("id") on update cascade on delete cascade;',
        );
        this.addSql('alter table "Product" add column "priceList" uuid null;');
        this.addSql(
            'alter table "Product" add constraint "Product_priceList_foreign" foreign key ("priceList") references "CometFileUpload" ("id") on update cascade on delete set null;',
        );
    }

    async down(): Promise<void> {
        this.addSql('alter table "Product" drop constraint "Product_priceList_foreign";');
        this.addSql('alter table "Product" drop column "priceList";');
    }
}
