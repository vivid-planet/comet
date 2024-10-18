import { Migration } from '@mikro-orm/migrations';

export class Migration20240426133251 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "Product" drop constraint if exists "Product_status_check";');
    this.addSql('alter table "Product" add constraint "Product_status_check" check ("status" in (\'Published\', \'Unpublished\', \'Deleted\'));');
  }
}
