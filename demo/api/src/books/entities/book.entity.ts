import { BlockDataInterface, RootBlock, RootBlockEntity } from "@comet/blocks-api";
import { CrudGenerator, DamImageBlock, DocumentInterface, RootBlockDataScalar, RootBlockType } from "@comet/cms-api";
import { BaseEntity, DecimalType, Entity, Enum, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Float, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { v4 as uuid } from "uuid";

import { LinkBlock } from "../../common/blocks/linkBlock/link.block";

export enum Publisher {
    Piper = "Piper",
    Ullstein = "Ullstein",
    Manhattan = "Manhattan Verlag",
}
registerEnumType(Publisher, {
    name: "Publisher",
});

@Entity()
@ObjectType({
    implements: () => [DocumentInterface],
})
@RootBlockEntity()
@CrudGenerator({ targetDirectory: `${__dirname}/../generated/` })
export class Book extends BaseEntity<Book, "id"> implements DocumentInterface {
    [OptionalProps]?: "createdAt" | "updatedAt";

    @PrimaryKey({ type: "uuid" })
    @Field(() => ID)
    id: string = uuid();

    @Property()
    @Field()
    title: string;

    @Property()
    @Field()
    description: string;

    @Property()
    @Field(() => Boolean)
    isAvailable: boolean;

    @Property({ type: Date })
    @Field(() => Date)
    releaseDate: Date;

    @Property({ columnType: "numeric(10,2)", type: DecimalType })
    @Field(() => Float)
    // numeric fields are retrieved as string by MikroORM
    // https://github.com/mikro-orm/mikro-orm/issues/2295
    price: string | number;

    @Enum({ items: () => Publisher })
    @Field(() => Publisher)
    publisher: Publisher;

    @Property({ customType: new RootBlockType(DamImageBlock) })
    @Field(() => RootBlockDataScalar(DamImageBlock))
    @RootBlock(DamImageBlock)
    coverImage: BlockDataInterface;

    @Property({ customType: new RootBlockType(LinkBlock) })
    @Field(() => RootBlockDataScalar(LinkBlock))
    @RootBlock(LinkBlock)
    link: BlockDataInterface;

    @Property({ columnType: "timestamp with time zone" })
    @Field()
    createdAt: Date = new Date();

    @Property({ columnType: "timestamp with time zone", onUpdate: () => new Date() })
    @Field()
    updatedAt: Date = new Date();
}
