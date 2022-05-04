import { BlockDataInterface } from "@comet/api-blocks";
import { DocumentInterface, RootBlockType } from "@comet/api-cms";
import { BaseEntity, Entity, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { LinkBlock } from "@src/common/blocks/linkBlock/link.block";
import { GraphQLJSONObject } from "graphql-type-json";
import { v4 } from "uuid";

@Entity()
@ObjectType({
    implements: () => [DocumentInterface],
})
export class Link extends BaseEntity<Link, "id"> implements DocumentInterface {
    [OptionalProps]?: "createdAt" | "updatedAt";

    @PrimaryKey({ columnType: "uuid" })
    @Field(() => ID)
    id: string = v4();

    @Property({ customType: new RootBlockType(LinkBlock) })
    @Field(() => GraphQLJSONObject)
    content: BlockDataInterface;

    @Property({
        columnType: "timestamp with time zone",
    })
    @Field()
    createdAt: Date = new Date();

    @Property({
        columnType: "timestamp with time zone",
        onUpdate: () => new Date(),
    })
    @Field()
    updatedAt: Date = new Date();
}
