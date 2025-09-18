import { BaseEntity, Entity, Enum, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-scalars";
import { v4 as uuid } from "uuid";

import { ContentScope } from "../../user-permissions/interfaces/content-scope.interface.js";
import { WarningSourceInfo } from "../dto/warning-source-info.js";
import { WarningSeverity } from "./warning-severity.enum.js";
import { WarningStatus } from "./warning-status.enum.js";

@ObjectType()
@Entity()
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

    @Enum({ items: () => WarningStatus })
    @Field(() => WarningStatus)
    status: WarningStatus = WarningStatus.open;

    @Field(() => GraphQLJSONObject, { nullable: true })
    @Property({ type: "jsonb", nullable: true })
    scope?: ContentScope;
}
