import { RootBlockEntity } from "@comet/api-blocks";
import { DocumentInterface } from "@comet/api-cms";
import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { v4 } from "uuid";

@RootBlockEntity()
@ObjectType({
    implements: () => [DocumentInterface],
})
@Entity()
export class News implements DocumentInterface {
    @PrimaryKey({ type: "uuid" })
    @Field(() => ID)
    id: string = v4();

    @Property()
    @Field()
    title: string;

    @Property()
    @Field()
    slug: string;

    @Property()
    @Field()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    @Field()
    updatedAt: Date = new Date();
}
