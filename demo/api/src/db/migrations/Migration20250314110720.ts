import { Migration } from '@mikro-orm/migrations';

export class Migration20250314110720 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "Page" add column "image" json not null;`);
  }
  
}
