import { Entity, Index, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { v4 as uuid } from "uuid";

import { ContentScope } from "../interfaces/content-scope.interface";

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

    @Property({ type: "json" })
    @Field(() => [LogUserPermissionPermission])
    permissions: LogUserPermissionPermission[];

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

@ObjectType()
export class LogUserPermissionPermission {
    @Property()
    @Field()
    permission: string;

    @Property({ type: "json" })
    @Field(() => [GraphQLJSONObject])
    contentScopes: ContentScope[] = [];
}
