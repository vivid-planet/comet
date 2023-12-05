import { Migration } from '@mikro-orm/migrations';

export class Migration20231204124414 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "PageTreeNode" alter column "category" drop default;');
    this.addSql('alter table "PageTreeNode" alter column "userGroup" drop default;');
  }

  async down(): Promise<void> {
    throw new Error('No revert');
  }

}
