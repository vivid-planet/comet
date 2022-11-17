import { BaseEntity, Entity, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 as uuid } from "uuid";

@Entity()
export class ChangesSinceLastBuild extends BaseEntity<ChangesSinceLastBuild, "id"> {
    [OptionalProps]?: "createdAt";

    @PrimaryKey({ columnType: "uuid" })
    id: string = uuid();

    @Property({
        columnType: "timestamp with time zone",
    })
    createdAt: Date = new Date();
}
