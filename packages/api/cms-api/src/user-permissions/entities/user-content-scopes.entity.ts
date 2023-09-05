import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

import { ContentScope } from "../interfaces/content-scope.interface";

@Entity()
export class UserContentScopes {
    @PrimaryKey()
    @Property()
    userId: string;

    @Property({ type: "json" })
    contentScopes: ContentScope[] = [];
}
