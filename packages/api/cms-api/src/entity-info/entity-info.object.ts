import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { FullTextType } from "@mikro-orm/postgresql";
import { Field, ObjectType } from "@nestjs/graphql";

// Note: This file is intentionally not named *.entity.ts to exclude it from MikroORM's CLI migration glob pattern.
// The "EntityInfo" view is created dynamically at startup by EntityInfoService, not via migrations.

@Entity({ tableName: "EntityInfo" })
@ObjectType("EntityInfo")
export class EntityInfoObject {
    @PrimaryKey({ type: "text" })
    id: string;

    @PrimaryKey({ type: "text" })
    entityName: string;

    @Field()
    @Property({ type: "text" })
    name: string;

    @Field({ nullable: true })
    @Property({ type: "text", nullable: true })
    secondaryInformation?: string;

    @Property({ type: "boolean" })
    visible: boolean;

    @Property({ type: FullTextType })
    fullText: string;
}
