import { Migration } from '@mikro-orm/migrations';

export class Migration20231204114637 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "News" alter column "visible" drop default;');
  }

  async down(): Promise<void> {
    throw new Error('No revert');
  }

}
