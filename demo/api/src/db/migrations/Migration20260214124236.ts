import { Migration } from "@mikro-orm/migrations";

export class Migration20260214124236 extends Migration {
    override async up(): Promise<void> {
        this.addSql(`alter table "Manufacturer" alter column "updatedAt" type timestamptz using ("updatedAt"::timestamptz);`);

        this.addSql(`alter table "News" alter column "date" type timestamptz using ("date"::timestamptz);`);

        this.addSql(`alter table "ProductStatistics" alter column "createdAt" type timestamptz using ("createdAt"::timestamptz);`);
        this.addSql(`alter table "ProductStatistics" alter column "updatedAt" type timestamptz using ("updatedAt"::timestamptz);`);

        this.addSql(`alter table "Product" alter column "createdAt" type timestamptz using ("createdAt"::timestamptz);`);
        this.addSql(`alter table "Product" alter column "updatedAt" type timestamptz using ("updatedAt"::timestamptz);`);
        this.addSql(`alter table "Product" alter column "lastCheckedAt" type timestamptz using ("lastCheckedAt"::timestamptz);`);

        this.addSql(`alter table "ProductColor" alter column "createdAt" type timestamptz using ("createdAt"::timestamptz);`);
        this.addSql(`alter table "ProductColor" alter column "updatedAt" type timestamptz using ("updatedAt"::timestamptz);`);

        this.addSql(`alter table "ProductTag" alter column "createdAt" type timestamptz using ("createdAt"::timestamptz);`);
        this.addSql(`alter table "ProductTag" alter column "updatedAt" type timestamptz using ("updatedAt"::timestamptz);`);

        this.addSql(`alter table "ProductVariant" alter column "createdAt" type timestamptz using ("createdAt"::timestamptz);`);
        this.addSql(`alter table "ProductVariant" alter column "updatedAt" type timestamptz using ("updatedAt"::timestamptz);`);
    }
}
