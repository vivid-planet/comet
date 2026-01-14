import { CrudGenerator } from "@comet/cms-api";
import { BaseEntity, Collection, Entity, OneToMany, OptionalProps, PrimaryKey, Property } from "@mikro-orm/postgresql";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { v4 as uuid } from "uuid";

import { Bar } from "./bar.entity";

@ObjectType()
@Entity()
@CrudGenerator({
    targetDirectory: `${__dirname}/../generated/`,
    requiredPermission: ["pageTree"],
})
export class Foo extends BaseEntity {
    [OptionalProps]?: "createdAt" | "updatedAt";

    @PrimaryKey({ type: "uuid" })
    @Field(() => ID)
    id: string = uuid();

    @Property()
    @Field()
    title: string;

    @Field(() => [Bar])
    @OneToMany(() => Bar, (bar) => bar.foo, { orphanRemoval: true })
    bars = new Collection<Bar>(this);
}
