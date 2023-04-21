import { BlockDataInterface, RootBlock, RootBlockEntity } from "@comet/blocks-api";
import { CrudField, CrudGenerator, DamImageBlock, DocumentInterface, RootBlockDataScalar, RootBlockType } from "@comet/cms-api";
import { BaseEntity, Entity, Enum, OptionalProps, PrimaryKey, Property, types } from "@mikro-orm/core";
import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { v4 as uuid } from "uuid";

export enum ProductType {
    Cap = "Cap",
    Shirt = "Shirt",
    Tie = "Tie",
}
registerEnumType(ProductType, {
    name: "ProductType",
});

@ObjectType({
    implements: () => [DocumentInterface],
})
@Entity()
@RootBlockEntity()
@CrudGenerator({ targetDirectory: `${__dirname}/../generated/` })
export class Product extends BaseEntity<Product, "id"> implements DocumentInterface {
    [OptionalProps]?: "createdAt" | "updatedAt";

    @PrimaryKey({ type: "uuid" })
    @Field(() => ID)
    id: string = uuid();

    @Property()
    @Field()
    @CrudField({
        search: true,
        filter: true,
        sort: true,
        input: true,
    })
    title: string;

    @Property()
    @Field()
    slug: string;

    @Property()
    @Field()
    description: string;

    @Enum({ items: () => ProductType })
    @Field(() => ProductType)
    type: ProductType;

    @Property({ type: types.decimal, nullable: true })
    @Field({ nullable: true })
    price?: number;

    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    @Property({ type: types.boolean })
    @Field()
    inStock: boolean = true;

    @Property({ customType: new RootBlockType(DamImageBlock) })
    @Field(() => RootBlockDataScalar(DamImageBlock))
    @RootBlock(DamImageBlock)
    image: BlockDataInterface;

    @Property()
    @Field()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    @Field()
    updatedAt: Date = new Date();
}
