import { CrudGenerator } from "@comet/cms-api";
import { BaseEntity, Collection, Entity, ManyToOne, OneToMany, OptionalProps, PrimaryKey, Property, Ref } from "@mikro-orm/postgresql";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { v4 as uuid } from "uuid";

import { Baz } from "./baz.entity";
import { Foo } from "./foo.entity";

@ObjectType()
@Entity()
@CrudGenerator({
    targetDirectory: `${__dirname}/../generated/`,
    requiredPermission: ["pageTree"],
})
export class Bar extends BaseEntity {
    [OptionalProps]?: "createdAt" | "updatedAt";

    @PrimaryKey({ type: "uuid" })
    @Field(() => ID)
    id: string = uuid();

    @Property()
    @Field()
    name: string;

    @Field(() => Foo)
    @ManyToOne(() => Foo, { ref: true, nullable: false })
    foo: Ref<Foo>;

    @Field(() => [Baz])
    @OneToMany(() => Baz, (baz) => baz.bar, { orphanRemoval: true })
    bazs = new Collection<Baz>(this);
}
