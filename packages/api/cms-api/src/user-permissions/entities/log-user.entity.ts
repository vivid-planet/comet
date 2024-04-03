import { Entity, Property } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { Field, ObjectType } from "@nestjs/graphql";

import { LogUserPermission } from "./log-user-permission.entity";

@ObjectType()
@Entity({
    expression: (em: EntityManager) => {
        return em
            .createQueryBuilder(LogUserPermission)
            .select(["userId", "name", "email", 'max("lastUsedAt") as "lastSeen"'])
            .groupBy(["userId", "name", "email"]);
    },
})
export class LogUser {
    @Property()
    @Field()
    userId: string;

    @Field()
    @Property()
    name: string;

    @Field()
    @Property()
    email: string;

    @Property({
        columnType: "timestamp with time zone",
    })
    @Field()
    lastSeen: Date;
}
