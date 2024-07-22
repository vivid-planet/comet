import { Migration } from '@mikro-orm/migrations';

export class Migration20240718122827 extends Migration {

  async up(): Promise<void> {
    this.addSql('truncate table "Product" cascade;');
    this.addSql('alter table "Product" add column "availableSince" date not null;');
  }

}
