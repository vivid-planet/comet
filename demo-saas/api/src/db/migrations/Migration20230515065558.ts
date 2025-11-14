import { Migration } from '@mikro-orm/migrations';

export class Migration20230515065558 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "Product" add column "visible" boolean null;');
    this.addSql('update "Product" set "visible"=true;');
    this.addSql('alter table "Product" alter column "visible" set not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "Product" drop column "visible";');
  }

}
