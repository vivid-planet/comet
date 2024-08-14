import { Migration } from '@mikro-orm/migrations';

export class Migration20231009090817 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "Product" add column "status" text check ("status" in (\'Published\', \'Unpublished\')) not null default \'Published\';');
    this.addSql('alter table "Product" alter column status drop default;');
    this.addSql('alter table "Product" drop column "visible";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "Product" drop column "status";');
    this.addSql('alter table "Product" add column "visible" bool not null default null;');
  }

}
