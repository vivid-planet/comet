import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { FullTextType } from "@mikro-orm/postgresql";
import { Field, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-scalars";

// Note: This file is intentionally not named *.entity.ts to exclude it from MikroORM's CLI migration glob pattern.
// The "EntityInfoFullText" view is created dynamically at startup by FullTextSearchService, not via migrations.

@Entity({ tableName: "EntityInfoFullText" })
@ObjectType("EntityInfoFullText")
export class EntityInfoFullTextObject {
    @PrimaryKey({ type: "text" })
    @Field()
    id: string;

    @PrimaryKey({ type: "text" })
    @Field()
    entityName: string;

    @Property({ type: FullTextType })
    fullText: string;

    @Field(() => GraphQLJSONObject, { nullable: true })
    @Property({ type: "json", nullable: true })
    scope?: Record<string, unknown>;
}
