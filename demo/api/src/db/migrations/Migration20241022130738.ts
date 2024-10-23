import { Migration } from '@mikro-orm/migrations';

export class Migration20241022130738 extends Migration {

  async up(): Promise<void> {
    // TODO: delete all migrations from warning and generate a new one
    this.addSql('alter table "Warning" drop constraint if exists "Warning_status_check";');
    this.addSql('alter table "Warning" add column "uniqueIdentifier" text not null;');
    this.addSql('alter table "Warning" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "Warning" add constraint "Warning_status_check" check ("status" in (\'open\', \'resolved\', \'ignored\'));');
    this.addSql('alter table "Warning" alter column "status" set default \'open\';');
    this.addSql('alter table "Warning" add column "message" text not null;');
  }

}
