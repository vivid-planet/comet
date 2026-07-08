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
    [OptionalProps]?: "createdAt" | "updatedAt" | "status";

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

    // Columns generated from `sourceInfo` so the EntityInfo relation can join on them without a QueryBuilder.
    @Property({ columnType: "text", nullable: true, generated: `("sourceInfo"->>'rootEntityName') stored` })
    rootEntityName?: string;

    @Property({ columnType: "text", nullable: true, generated: `("sourceInfo"->>'targetId') stored` })
    targetId?: string;

    // Read-only join to the EntityInfo view, keyed by the generated columns. Lets the warnings grid
    // filter/sort/search by name and secondary information natively via `populate`.
    @ManyToOne(() => EntityInfoObject, {
        joinColumns: ["targetId", "rootEntityName"],
        referencedColumnNames: ["id", "entityName"],
        nullable: true,
    })
    @Field(() => EntityInfoObject, { nullable: true })
    entityInfo?: EntityInfoObject;

    @Enum({ items: () => WarningStatus })
    @Field(() => WarningStatus)
    status: WarningStatus = WarningStatus.open;

    @Field(() => GraphQLJSONObject, { nullable: true })
    @Property({ type: "jsonb", nullable: true })
    scope?: ContentScope;
}
