import { BaseEntity, Entity, Enum, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { v4 as uuid } from "uuid";

import { WarningSourceInfo } from "../dto/warning-source-info";
import { WarningSeverity } from "./warning-severity.enum";
import { WarningStatus } from "./warning-status.enum";

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

    @Property()
    @Field()
    type: string;

    @Enum({ items: () => WarningSeverity })
    @Field(() => WarningSeverity)
    severity: "critical" | "high" | "low";

    @Property({ type: "jsonb" })
    sourceInfo: WarningSourceInfo;

    @Enum({ items: () => WarningStatus })
    @Field(() => WarningStatus)
    status: WarningStatus = WarningStatus.open;
}
