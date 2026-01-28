import { Migration } from '@mikro-orm/migrations';

export class Migration20251118143418 extends Migration {

  override async up(): Promise<void> {
    this.addSql('create index "Warning_status_scope_index" on "Warning" ("status", "scope");'); // compound index because fields are filtered together
    this.addSql(`create index "Warning_sourceinfo_index" ON "Warning" ("updatedAt", ("sourceInfo"->>'rootEntityName'),("sourceInfo"->>'rootColumnName'),("sourceInfo"->>'targetId'),("sourceInfo"->>'rootPrimaryKey'));`); // compound index because fields are filtered together
  }

}
