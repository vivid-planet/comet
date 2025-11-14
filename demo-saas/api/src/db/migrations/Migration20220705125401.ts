import { Migration } from '@mikro-orm/migrations';

export class Migration20220705125401 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "PageTreeNode" drop constraint if exists "PageTreeNode_category_check";');
    this.addSql('UPDATE "PageTreeNode" SET category=\'MainNavigation\' WHERE category=\'main-navigation\'')
    this.addSql('alter table "PageTreeNode" add constraint "PageTreeNode_category_check" check ("category" in (\'MainNavigation\', \'TopMenu\'));');
    this.addSql('alter table "PageTreeNode" alter column "category" set default \'MainNavigation\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "PageTreeNode" drop constraint if exists "PageTreeNode_category_check";');
    this.addSql('alter table "PageTreeNode" add constraint "PageTreeNode_category_check" check ("category" in (\'main-navigation\'));');
    this.addSql('alter table "PageTreeNode" alter column "category" set default \'main-navigation\';');
  }

}
