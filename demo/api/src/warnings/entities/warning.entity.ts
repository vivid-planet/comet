import { CrudField, CrudGenerator, RootBlockEntity } from "@comet/cms-api";
import { BaseEntity, Entity, Enum, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { v4 as uuid } from "uuid";

import { WarningSeverity } from "./warning-severity.enum";
import { WarningStatus } from "./warning-status.enum";

@ObjectType()
@Entity()
@RootBlockEntity<Warning>()
@CrudGenerator({ targetDirectory: `${__dirname}/../generated/`, requiredPermission: ["warnings"] })
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
    @CrudField()
    message: string;

    @Property()
    @Field()
    @CrudField()
    type: string;

    @Enum({ items: () => WarningSeverity })
    @Field(() => WarningSeverity)
    severity: WarningSeverity;

    // TODO: add blockInfos with COM-958

    @Enum({ items: () => WarningStatus })
    @Field(() => WarningStatus)
    status: WarningStatus = WarningStatus.open;
}
