import { BaseEntity, Entity, Enum, Index, ManyToOne, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-scalars";
import { v4 as uuid } from "uuid";

import { EntityInfoObject } from "../../entity-info/entity-info.object";
import { ContentScope } from "../../user-permissions/interfaces/content-scope.interface";
import { WarningSourceInfo } from "../dto/warning-source-info";
import { WarningSeverity } from "./warning-severity.enum";
import { WarningStatus } from "./warning-status.enum";

@ObjectType()
@Entity()
// Index Decorator does nothing, migration has to be created manually as the entity is in library
@Index({ properties: ["status", "scope"] })
@Index({
    properties: ["updatedAt", "sourceInfo.rootEntityName", "sourceInfo.rootColumnName", "sourceInfo.targetId", "sourceInfo.rootPrimaryKey"],
})
// Join keys for the EntityInfo relation (warnings grid filter/sort by name/info)
@Index({ properties: ["rootEntityName", "targetId"] })
export class Warning extends BaseEntity {
    [OptionalProps]?: "createdAt" | "updatedAt" | "status" | "rootEntityName" | "targetId";

    @PrimaryKey({ type: "uuid" })
    @Field(() => ID)
    id: string = uuid();

    @Property({ columnType: "timestamp with time zone" })
    @Field()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date(), columnType: "timestamp with time zone" })
    @Field()
    updatedAt: Date = new Date();

    @Property({ columnType: "text" })
    @Field()
    message: string;

    @Enum({ items: () => WarningSeverity })
    @Field(() => WarningSeverity)
    severity: `${WarningSeverity}`;

    @Property({ type: "jsonb" })
    @Field()
    sourceInfo: WarningSourceInfo;

    @Enum({ items: () => WarningStatus })
    @Field(() => WarningStatus)
    status: WarningStatus = WarningStatus.open;

    @Field(() => GraphQLJSONObject, { nullable: true })
    @Property({ type: "jsonb", nullable: true })
    scope?: ContentScope;

    // Read-only columns generated from `sourceInfo`, used as join keys for the `entityInfo` relation. They mirror the
    // EntityInfo view's `entityName` / `id` primary key so MikroORM can join to it without a query builder.
    @Property({ columnType: "text", generated: `("sourceInfo"->>'rootEntityName') stored`, persist: false })
    rootEntityName: string;

    @Property({ columnType: "text", generated: `("sourceInfo"->>'targetId') stored`, persist: false })
    targetId: string;

    // Related EntityInfo (name, secondaryInformation, …), resolved by joining the EntityInfo view on the generated
    // columns above. Read-only (no foreign key, the target is a view) — same mechanism as the full-text search module.
    @ManyToOne(() => EntityInfoObject, {
        joinColumns: ["rootEntityName", "targetId"],
        referencedColumnNames: ["entityName", "id"],
        nullable: true,
        createForeignKeyConstraint: false,
    })
    @Field(() => EntityInfoObject, { nullable: true })
    entityInfo?: EntityInfoObject;
}
