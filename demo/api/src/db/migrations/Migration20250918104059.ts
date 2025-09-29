import { Migration } from '@mikro-orm/migrations';

export class Migration20250918104059 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "ProductCategoryType" ("id" uuid not null, "title" varchar(255) not null, constraint "ProductCategoryType_pkey" primary key ("id"));`);

    this.addSql(`alter table "ProductCategory" add column "type" uuid null;`);
    this.addSql(`alter table "ProductCategory" alter column "createdAt" type timestamptz using ("createdAt"::timestamptz);`);
    this.addSql(`alter table "ProductCategory" alter column "updatedAt" type timestamptz using ("updatedAt"::timestamptz);`);
    this.addSql(`alter table "ProductCategory" add constraint "ProductCategory_type_foreign" foreign key ("type") references "ProductCategoryType" ("id") on update cascade on delete set null;`);
  }
}
