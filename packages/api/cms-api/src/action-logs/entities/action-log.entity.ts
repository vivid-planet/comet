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

    @Field(() => GraphQLJSONObject, {
        nullable: true,
        description: "Snapshot of the entity at the time of the action, migrated to the current schema when read.",
    })
    @Property({ type: "jsonb", nullable: true })
    snapshot?: Record<string, unknown>;

    @Property({ type: "integer", nullable: true })
    snapshotVersion?: number;

    @Field()
    @Property({ type: Date, columnType: "timestamp with time zone" })
    createdAt: Date = new Date();
}
