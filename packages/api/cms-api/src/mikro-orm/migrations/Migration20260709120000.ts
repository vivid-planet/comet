import { Migration } from "@mikro-orm/migrations";

export class Migration20260709120000 extends Migration {
    override async up(): Promise<void> {
        // Materialize the EntityInfo join keys as generated columns so the `entityInfo` relation can join the
        // EntityInfo view on plain columns instead of JSONB expressions (see Warning.entityInfo).
        this.addSql(`alter table "Warning" add column "rootEntityName" text generated always as ("sourceInfo"->>'rootEntityName') stored;`);
        this.addSql(`alter table "Warning" add column "targetId" text generated always as ("sourceInfo"->>'targetId') stored;`);

        // Replace the JSONB-expression join index with one on the generated columns the relation now joins on.
        this.addSql(`drop index if exists "Warning_sourceinfo_join_index";`);
        this.addSql(`create index "Warning_entityinfo_join_index" on "Warning" ("rootEntityName", "targetId");`);
    }
}
