import { Migration } from '@mikro-orm/migrations';

export class Migration20230321162015 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "Product" add column "type" text check ("type" in (\'Foo\', \'Bar\', \'Baz\')) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "Product" drop column "type";');
  }

}
