import { Migration } from '@mikro-orm/migrations';

export class Migration20251210102828 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "TenantUser" alter column "userId" type text using ("userId"::text);`);
  }

}
