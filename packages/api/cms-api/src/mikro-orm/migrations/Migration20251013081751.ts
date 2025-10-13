import { Migration } from '@mikro-orm/migrations';

export class Migration20251013081751 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "CometFileUpload" add column "expiresAt" timestamp with time zone null;`);
  }

}
