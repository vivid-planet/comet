import { Migration } from "@mikro-orm/migrations";

export class Migration20240814090355 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "News" drop constraint if exists "News_category_check";');
        this.addSql('alter table "News" drop constraint if exists "News_status_check";');

        this.addSql('alter table "Product" drop constraint if exists "Product_status_check";');

        this.addSql('alter table "Product" drop constraint "Product_statistics_foreign";');

        this.addSql('alter table "News" alter column "category" type text using ("category"::text);');
        this.addSql("alter table \"News\" add constraint \"News_category_check\" check (\"category\" in ('Events', 'Company', 'Awards'));");
        this.addSql('alter table "News" alter column "category" set default \'Awards\';');
        this.addSql('alter table "News" alter column "status" type text using ("status"::text);');
        this.addSql('alter table "News" add constraint "News_status_check" check ("status" in (\'Active\', \'Deleted\'));');
        this.addSql('alter table "News" alter column "status" set default \'Active\';');

        this.addSql('alter table "Product" alter column "description" type varchar(255) using ("description"::varchar(255));');
        this.addSql('alter table "Product" alter column "createdAt" type timestamptz(0) using ("createdAt"::timestamptz(0));');
        this.addSql('alter table "Product" alter column "updatedAt" type timestamptz(0) using ("updatedAt"::timestamptz(0));');
        this.addSql('alter table "Product" alter column "inStock" type boolean using ("inStock"::boolean);');
        this.addSql('alter table "Product" alter column "inStock" set default true;');
        this.addSql('alter table "Product" alter column "status" type text using ("status"::text);');
        this.addSql("alter table \"Product\" add constraint \"Product_status_check\" check (\"status\" in ('Published', 'Unpublished', 'Deleted'));");
        this.addSql('alter table "Product" alter column "status" set default \'Unpublished\';');
        this.addSql(
            'alter table "Product" add constraint "Product_statistics_foreign" foreign key ("statistics") references "ProductStatistics" ("id") on update cascade on delete set null;',
        );
    }
}
