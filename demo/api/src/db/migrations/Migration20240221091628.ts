import { Migration } from '@mikro-orm/migrations';

export class Migration20240221091628 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "Product" add column "manufacturer" uuid null;');
    this.addSql('alter table "Product" add constraint "Product_manufacturer_foreign" foreign key ("manufacturer") references "Manufacturer" ("id") on update cascade on delete set null;');
    this.addSql('create index "Product_manufacturer_index" on "Product" ("manufacturer");');
  }
}
