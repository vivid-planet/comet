import { BaseEntity, Entity, OptionalProps, PrimaryKey, PrimaryKeyProp } from "@mikro-orm/core";
import { Index, Property } from "@mikro-orm/postgresql";
import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-scalars";
import { v7 } from "uuid";

import { ContentScope } from "../../user-permissions/interfaces/content-scope.interface";

@Entity()
@ObjectType()
@Index({ properties: ["entityName", "entityId"] })
export class ActionLog extends BaseEntity {
    [PrimaryKeyProp]?: "id";
    [OptionalProps]?: "createdAt";

    @Field(() => ID)
    @PrimaryKey({ type: "uuid" })
    id: string = v7();

    @Field(() => [GraphQLJSONObject], { nullable: true })
    @Property({ type: "jsonb", nullable: true })
    @Index({ type: "gin" })
    scope?: ContentScope[];

    @Field(() => ID)
    @Property({ type: "text", index: true })
    userId: string;

    @Field()
    @Property({ type: "text" })
    entityName: string;

    @Field(() => ID)
    @Property({ type: "uuid" })
    entityId: string;

    @Field(() => Int)
    @Property({ type: "integer" })
    version: number;

    @Field(() => GraphQLJSONObject, { nullable: true })
    @Property({ type: "jsonb", nullable: true })
    snapshot?: Record<string, unknown>;

    @Field()
    @Property({ type: Date, columnType: "timestamp with time zone" })
    createdAt: Date = new Date();
}
