import { Entity, Index, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { v4 as uuid } from "uuid";

@Entity({ tableName: "CometUserPermissionsLog" })
@ObjectType()
export class LogUserPermission {
    @PrimaryKey({ columnType: "uuid" })
    @Field(() => ID)
    id: string = uuid();

    @PrimaryKey()
    @Property()
    @Index()
    userId: string;

    @Property()
    name: string;

    @Property()
    email: string;

    @Property()
    @Field()
    permissions: string;

    @Property()
    @Field()
    firstUsedAt: Date = new Date();

    @Property()
    @Field()
    lastUsedAt: Date = new Date();

    @Property()
    @Field()
    usages: number;
}
