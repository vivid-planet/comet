import { Migration } from '@mikro-orm/migrations';

export class Migration20220530081645 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "PageTreeNode" add column "userGroup" text check ("userGroup" in (\'All\', \'Admin\', \'User\')) not null default \'All\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "PageTreeNode" drop column "userGroup";');
  }

}