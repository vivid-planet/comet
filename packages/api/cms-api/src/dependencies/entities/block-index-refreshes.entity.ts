import { BaseEntity, Entity, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 as uuid } from "uuid";

@Entity()
export class BlockIndexRefreshes extends BaseEntity<BlockIndexRefreshes, "id"> {
    [OptionalProps]?: "createdAt";

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
