import { Migration } from '@mikro-orm/migrations';

export class Migration20230906105233 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "ShopProductVariant" add column "name" varchar(255) not null;');
  }

}
