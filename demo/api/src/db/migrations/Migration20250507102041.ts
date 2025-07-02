import { Migration } from '@mikro-orm/migrations';

export class Migration20250507102041 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table "Manufacturer" add column "coordinates" point null;`);
  }
}
