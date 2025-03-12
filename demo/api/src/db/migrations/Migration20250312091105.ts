import { Migration } from '@mikro-orm/migrations';

export class Migration20250312091105 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "Warning" alter column "dependencyInfo" type jsonb using ("dependencyInfo"::jsonb);`);
    this.addSql(`alter table "Warning" alter column "dependencyInfo" drop not null;`);
  }
}
