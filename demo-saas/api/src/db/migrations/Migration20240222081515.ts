import { Migration } from '@mikro-orm/migrations';

export class Migration20240222081515 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "Product" drop column "packageDimensions_width";');
    this.addSql('alter table "Product" drop column "packageDimensions_height";');
    this.addSql('alter table "Product" drop column "packageDimensions_depth";');
  }
}
