import { Migration } from '@mikro-orm/migrations';

export class Migration20250218090446 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "Warning" add column "sourceInfo" jsonb not null;');
  }
}
