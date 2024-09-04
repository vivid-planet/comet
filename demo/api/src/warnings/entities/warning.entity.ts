import { RootBlockEntity } from "@comet/blocks-api";
import { CrudField, CrudGenerator } from "@comet/cms-api";
import { BaseEntity, Entity, Enum, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { v4 as uuid } from "uuid";

import { WarningLevel } from "./warning-level.enum";
import { WarningState } from "./warning-state.enum";

@ObjectType()
@Entity()
@RootBlockEntity<Warning>()
@CrudGenerator({ targetDirectory: `${__dirname}/../generated/`, requiredPermission: ["pageTree"] })
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

    @Property()
    @Field()
    @CrudField()
    type: string;

    @Enum({ items: () => WarningLevel })
    @Field(() => WarningLevel)
    level: WarningLevel;

    // TODO: add blockInfos with COM-958

    @Enum({ items: () => WarningState })
    @Field(() => WarningState)
    state: WarningState;
}
