import { BaseEntity, Entity, Index, PrimaryKey, Property } from "@mikro-orm/postgresql";
import { v4 as uuid } from "uuid";

// Partial unique index: at most one in-progress refresh (finishedAt = null) may exist at a time.
// This makes the lock-free claim in DependenciesService atomic across API pods without an advisory
// lock — concurrent claimants race to insert the single allowed in-progress row and all but one hit
// ON CONFLICT DO NOTHING, so only one REFRESH MATERIALIZED VIEW runs per database.
@Entity()
@Index({
    name: "BlockIndexRefresh_single_running",
    expression: 'create unique index "BlockIndexRefresh_single_running" on "BlockIndexRefresh" (("finishedAt" IS NULL)) where "finishedAt" IS NULL',
})
export class BlockIndexRefresh extends BaseEntity {
    @PrimaryKey({ columnType: "uuid" })
    id: string = uuid();

    @Property({
        columnType: "timestamp with time zone",
    })
    startedAt: Date;

    @Property({
        columnType: "timestamp with time zone",
        nullable: true,
    })
    finishedAt: Date | null;
}
