import { Migration } from '@mikro-orm/migrations';

export class Migration20250311143752 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "Warning" add column "scope" jsonb null;`);
  }

}
