import { RootBlockEntity } from "@comet/blocks-api";
import { CrudField, CrudGenerator } from "@comet/cms-api";
import { BaseEntity, Entity, Enum, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { v4 as uuid } from "uuid";

import { WarningSeverity } from "./warning-severity.enum";
import { WarningStatus } from "./warning-status.enum";

@ObjectType()
@Entity()
@RootBlockEntity<Warning>()
@CrudGenerator({ targetDirectory: `${__dirname}/../generated/`, requiredPermission: ["warnings"] })
export class Warning extends BaseEntity<Warning, "id"> {
    [OptionalProps]?: "createdAt" | "updatedAt" | "status";

    @PrimaryKey({ type: "uuid" })
    @Field(() => ID)
    id: string = uuid();

    @Property()
    @Field()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
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
