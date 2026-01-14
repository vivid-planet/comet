import { CrudGenerator } from "@comet/cms-api";
import { BaseEntity, Entity, ManyToOne, OptionalProps, PrimaryKey, Property, Ref } from "@mikro-orm/postgresql";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { v4 as uuid } from "uuid";

import { Bar } from "./bar.entity";

@ObjectType()
@Entity()
@CrudGenerator({
    targetDirectory: `${__dirname}/../generated/`,
    requiredPermission: ["pageTree"],
})
export class Baz extends BaseEntity {
    [OptionalProps]?: "createdAt" | "updatedAt";

    @PrimaryKey({ type: "uuid" })
    @Field(() => ID)
    id: string = uuid();

    @Property()
    @Field()
    description: string;

    @Field(() => Bar)
    @ManyToOne(() => Bar, { ref: true, nullable: false })
    bar: Ref<Bar>;
}
