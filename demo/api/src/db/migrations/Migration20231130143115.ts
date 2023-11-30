import { Migration } from '@mikro-orm/migrations';

export class Migration20231130143115 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "News" drop constraint if exists "News_category_check";');
    this.addSql('alter table "News" add constraint "News_category_check" check ("category" in (\'EVENTS\', \'COMPANY\', \'AWARDS\', \'PRODUCT_LAUNCH\', \'NEW_MARKET_STRATEGY\'));');
    this.addSql('alter table "News" alter column "category" set default \'AWARDS\';');
  }

}
