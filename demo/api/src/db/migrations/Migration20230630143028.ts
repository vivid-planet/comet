import { Migration } from '@mikro-orm/migrations';

export class Migration20230630143028 extends Migration {

  async up(): Promise<void> {
    this.addSql('truncate table "ProductVariant";');
    this.addSql('truncate table "Product" cascade;');
    this.addSql('alter table "Product" add column "discounts" jsonb not null, add column "articleNumbers" jsonb not null, add column "dimensions" jsonb null;');
    this.addSql('alter table "Product" add column "packageDimensions_width" int not null, add column "packageDimensions_height" int not null, add column "packageDimensions_depth" int not null;');
    this.addSql('alter table "ProductVariant" add column "image" json not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "Product" drop column "discounts";');
    this.addSql('alter table "Product" drop column "articleNumbers";');
    this.addSql('alter table "Product" drop column "dimensions";');
    this.addSql('alter table "Product" drop column "packageDimensions_width";');
    this.addSql('alter table "Product" drop column "packageDimensions_height";');
    this.addSql('alter table "Product" drop column "packageDimensions_depth";');
    this.addSql('alter table "ProductVariant" drop column "image";');
  }

}
