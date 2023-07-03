import { BaseEntity, Embedded, Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
/* eslint-disable @typescript-eslint/naming-convention */
import { GraphQLJSONObject } from "graphql-type-json";
import { v4 } from "uuid";

import { PermissionConfiguration } from "../user-management.types";
import { UserContentScope } from "./user-content-scopes.entity";

export enum UserPermissionSource {
    MANUAL = "manual",
    BY_RULE = "by rule",
}
registerEnumType(UserPermissionSource, {
    name: "UserPermissionSource",
});

@ObjectType()
@Entity()
export class UserPermission extends BaseEntity<UserPermission, "id"> {
    @Field(() => ID)
    @PrimaryKey({ type: "uuid" })
    id: string = v4();

    @Property()
    userId: string;

    @Field(() => UserPermissionSource, { nullable: true })
    source: UserPermissionSource;

    @Field()
    @Property({ columnType: "text" })
    permission: string;

    @Field(() => GraphQLJSONObject, { nullable: true })
    @Property({ type: "json", nullable: true })
    configuration?: PermissionConfiguration;

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

    @Field(() => Boolean)
    @Property({ columnType: "boolean" })
    overrideContentScopes = false;

    @Field(() => [UserContentScope])
    @Embedded(() => UserContentScope, { array: true })
    contentScopes: UserContentScope[] = [];
}
