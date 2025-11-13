import { Migration } from '@mikro-orm/migrations';

export class Migration20230905092040 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "Product" add column "soldCount" numeric(10,0) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "Product" drop column "soldCount";');
  }

}
