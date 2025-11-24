import { Migration } from '@mikro-orm/migrations';

export class Migration20240516085053 extends Migration {

  async up(): Promise<void> {
    this.addSql('update "Product" set "manufacturer" = null;');
    this.addSql('delete from "Manufacturer";');
    this.addSql('alter table "Manufacturer" add column "name" varchar(255) not null;');
  }
}

