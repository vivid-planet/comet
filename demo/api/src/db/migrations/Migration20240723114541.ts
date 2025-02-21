import { Migration } from '@mikro-orm/migrations';

export class Migration20240723114541 extends Migration {

  async up(): Promise<void> {
    this.addSql('delete from "ProductCategory";');
    this.addSql('alter table "ProductCategory" add column "position" integer not null;');
  }
}
