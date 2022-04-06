import { BaseEntity, Entity, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 } from "uuid";

@Entity()
export class ChangesSinceLastBuild extends BaseEntity<ChangesSinceLastBuild, "id"> {
    [OptionalProps]?: "createdAt";

    @PrimaryKey({ columnType: "uuid" })
    id: string = v4();

    @Property({
        columnType: "timestamp with time zone",
    })
    createdAt: Date = new Date();
}
