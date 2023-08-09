import { BaseEntity, Entity, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 as uuid } from "uuid";

import { ContentScope } from "../../user-permissions/interfaces/content-scope.interface";

@Entity()
export class ChangesSinceLastBuild extends BaseEntity<ChangesSinceLastBuild, "id"> {
    [OptionalProps]?: "createdAt";

    @PrimaryKey({ columnType: "uuid" })
    id: string = uuid();

    @Property({
        columnType: "timestamp with time zone",
    })
    createdAt: Date = new Date();

    @Property({ type: "json" })
    scope: "all" | ContentScope;
}
