import { Migration } from '@mikro-orm/migrations';

export class Migration20251202101544 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "Product" drop column "image";`);
  }

}
