import { BaseEntity, Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 as uuid } from "uuid";

@Entity()
export class BlockIndexRefresh extends BaseEntity<BlockIndexRefresh, "id"> {
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
