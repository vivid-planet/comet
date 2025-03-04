import { Migration } from '@mikro-orm/migrations';

export class Migration20250225123757 extends Migration {

  override async up(): Promise<void> {

    this.addSql(`alter table "Warning" alter column "createdAt" type timestamp with time zone using ("createdAt"::timestamp with time zone);`);
    this.addSql(`alter table "Warning" alter column "updatedAt" type timestamp with time zone using ("updatedAt"::timestamp with time zone);`);
  }

}
