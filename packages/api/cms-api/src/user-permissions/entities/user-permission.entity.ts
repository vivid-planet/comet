import { BaseEntity, Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { v4 } from "uuid";

import { ContentScope } from "../interfaces/content-scope.interface";
import { Permission } from "../interfaces/user-permission.interface";

export enum UserPermissionSource {
    MANUAL = "MANUAL",
    BY_RULE = "BY_RULE",
}
registerEnumType(UserPermissionSource, {
    name: "UserPermissionSource",
});

@ObjectType()
@Entity({ tableName: "CometUserPermission" })
export class UserPermission extends BaseEntity<UserPermission, "id"> {
    @Field(() => ID)
    @PrimaryKey({ type: "uuid" })
    id: string = v4();

    @Property()
    userId: string;

    @Field(() => UserPermissionSource)
    source: UserPermissionSource;

    @Field()
    @Property({ columnType: "text" })
    permission: string;

    @Field(() => GraphQLJSONObject, { nullable: true })
    @Property({ type: "json", nullable: true })
    configuration?: Permission[keyof Permission];

    @Field(() => Date, { nullable: true })
    @Property({ columnType: "date", nullable: true })
    validFrom?: Date;

    @Field(() => Date, { nullable: true })
    @Property({ columnType: "date", nullable: true })
    validTo?: Date;

    @Field({ nullable: true })
    @Property({ columnType: "text", nullable: true })
    reason?: string;

    @Field({ nullable: true })
    @Property({ columnType: "text", nullable: true })
    requestedBy?: string;

    @Field({ nullable: true })
    @Property({ columnType: "text", nullable: true })
    approvedBy?: string;

    @Field()
    @Property()
    overrideContentScopes: boolean = false;

    @Field(() => [GraphQLJSONObject])
    @Property({ type: "json" })
    contentScopes: ContentScope[] = [];
}
