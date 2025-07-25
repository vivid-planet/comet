import { Entity, PrimaryKey, Property } from "@mikro-orm/postgresql";

import { ContentScope } from "../interfaces/content-scope.interface";

@Entity({ tableName: "CometUserContentScopes" })
export class UserContentScopes {
    @PrimaryKey()
    @Property()
    userId: string;

    @Property({ type: "json" })
    contentScopes: ContentScope[] = [];
}
