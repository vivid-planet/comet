import { Migration } from "@mikro-orm/migrations";

export class Migration20260213103747 extends Migration {
    override async up(): Promise<void> {
        // Convert all varchar columns to text for string attributes
        
        // Manufacturer table
        this.addSql(`alter table "Manufacturer" alter column "name" type text using ("name"::text);`);
        this.addSql(`alter table "Manufacturer" alter column "addressAsEmbeddable_street" type text using ("addressAsEmbeddable_street"::text);`);
        this.addSql(`alter table "Manufacturer" alter column "addressAsEmbeddable_zip" type text using ("addressAsEmbeddable_zip"::text);`);
        this.addSql(`alter table "Manufacturer" alter column "addressAsEmbeddable_country" type text using ("addressAsEmbeddable_country"::text);`);
        this.addSql(
            `alter table "Manufacturer" alter column "addressAsEmbeddable_alternativeAddress_street" type text using ("addressAsEmbeddable_alternativeAddress_street"::text);`,
        );
        this.addSql(
            `alter table "Manufacturer" alter column "addressAsEmbeddable_alternativeAddress_zip" type text using ("addressAsEmbeddable_alternativeAddress_zip"::text);`,
        );
        this.addSql(
            `alter table "Manufacturer" alter column "addressAsEmbeddable_alternativeAddress_country" type text using ("addressAsEmbeddable_alternativeAddress_country"::text);`,
        );

        // News table
        this.addSql(`alter table "News" alter column "title" type text using ("title"::text);`);
        this.addSql(`alter table "News" alter column "slug" type text using ("slug"::text);`);

        // NewsComment table
        this.addSql(`alter table "NewsComment" alter column "comment" type text using ("comment"::text);`);

        // Product tables
        this.addSql(`alter table "Product" alter column "title" type text using ("title"::text);`);
        this.addSql(`alter table "Product" alter column "slug" type text using ("slug"::text);`);
        this.addSql(`alter table "Product" alter column "description" type text using ("description"::text);`);

        this.addSql(`alter table "ProductCategory" alter column "title" type text using ("title"::text);`);
        this.addSql(`alter table "ProductCategory" alter column "slug" type text using ("slug"::text);`);

        this.addSql(`alter table "ProductCategoryType" alter column "title" type text using ("title"::text);`);

        this.addSql(`alter table "ProductColor" alter column "name" type text using ("name"::text);`);
        this.addSql(`alter table "ProductColor" alter column "hexCode" type text using ("hexCode"::text);`);

        this.addSql(`alter table "ProductTag" alter column "title" type text using ("title"::text);`);

        this.addSql(`alter table "ProductVariant" alter column "name" type text using ("name"::text);`);
    }

    override async down(): Promise<void> {
        // Revert text columns back to varchar(255)
        
        // Manufacturer table
        this.addSql(`alter table "Manufacturer" alter column "name" type varchar(255) using ("name"::varchar(255));`);
        this.addSql(`alter table "Manufacturer" alter column "addressAsEmbeddable_street" type varchar(255) using ("addressAsEmbeddable_street"::varchar(255));`);
        this.addSql(`alter table "Manufacturer" alter column "addressAsEmbeddable_zip" type varchar(255) using ("addressAsEmbeddable_zip"::varchar(255));`);
        this.addSql(`alter table "Manufacturer" alter column "addressAsEmbeddable_country" type varchar(255) using ("addressAsEmbeddable_country"::varchar(255));`);
        this.addSql(
            `alter table "Manufacturer" alter column "addressAsEmbeddable_alternativeAddress_street" type varchar(255) using ("addressAsEmbeddable_alternativeAddress_street"::varchar(255));`,
        );
        this.addSql(
            `alter table "Manufacturer" alter column "addressAsEmbeddable_alternativeAddress_zip" type varchar(255) using ("addressAsEmbeddable_alternativeAddress_zip"::varchar(255));`,
        );
        this.addSql(
            `alter table "Manufacturer" alter column "addressAsEmbeddable_alternativeAddress_country" type varchar(255) using ("addressAsEmbeddable_alternativeAddress_country"::varchar(255));`,
        );

        // News table
        this.addSql(`alter table "News" alter column "title" type varchar(255) using ("title"::varchar(255));`);
        this.addSql(`alter table "News" alter column "slug" type varchar(255) using ("slug"::varchar(255));`);

        // NewsComment table
        this.addSql(`alter table "NewsComment" alter column "comment" type varchar(255) using ("comment"::varchar(255));`);

        // Product tables
        this.addSql(`alter table "Product" alter column "title" type varchar(255) using ("title"::varchar(255));`);
        this.addSql(`alter table "Product" alter column "slug" type varchar(255) using ("slug"::varchar(255));`);
        this.addSql(`alter table "Product" alter column "description" type varchar(255) using ("description"::varchar(255));`);

        this.addSql(`alter table "ProductCategory" alter column "title" type varchar(255) using ("title"::varchar(255));`);
        this.addSql(`alter table "ProductCategory" alter column "slug" type varchar(255) using ("slug"::varchar(255));`);

        this.addSql(`alter table "ProductCategoryType" alter column "title" type varchar(255) using ("title"::varchar(255));`);

        this.addSql(`alter table "ProductColor" alter column "name" type varchar(255) using ("name"::varchar(255));`);
        this.addSql(`alter table "ProductColor" alter column "hexCode" type varchar(255) using ("hexCode"::varchar(255));`);

        this.addSql(`alter table "ProductTag" alter column "title" type varchar(255) using ("title"::varchar(255));`);

        this.addSql(`alter table "ProductVariant" alter column "name" type varchar(255) using ("name"::varchar(255));`);
    }
}
