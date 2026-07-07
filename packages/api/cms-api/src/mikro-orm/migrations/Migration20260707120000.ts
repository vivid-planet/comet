import { Migration } from "@mikro-orm/migrations";

export class Migration20260707120000 extends Migration {
    override async up(): Promise<void> {
        // Index the EntityInfo join keys. This gives the planner real statistics on these JSONB
        // expressions and a fast lookup path, so the warnings-grid join to the EntityInfo view stays
        // bounded. Without it a nested-loop join can rescan the un-indexed EntityInfo union once per
        // warning row (seconds on skewed data); with it that plan degrades to an index probe.
        this.addSql(
            `create index "Warning_sourceinfo_join_index" on "Warning" (("sourceInfo"->>'rootEntityName'), ("sourceInfo"->>'targetId'));`,
        );
    }
}
