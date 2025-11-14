import { Migration } from '@mikro-orm/migrations';

export class Migration20240723123838 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "Product" add column "lastCheckedAt" timestamptz(0) null;');
  }

}
