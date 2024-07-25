import { Migration } from '@mikro-orm/migrations';

export class Migration20240624100640 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "ProductCategory" add column "position" int;');
    this.addSql('create temporary sequence number_sequence;');
    this.addSql('update "ProductCategory" set position = nextval(\'number_sequence\');');
    this.addSql('drop sequence number_sequence;');
    this.addSql('alter table "ProductCategory" alter column "position" set not null;');
  }
}
