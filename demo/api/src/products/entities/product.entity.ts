import { BlockDataInterface, RootBlock, RootBlockEntity } from "@comet/blocks-api";
import { CrudField, CrudGenerator, DamImageBlock, DocumentInterface, RootBlockDataScalar, RootBlockType } from "@comet/cms-api";
import {
    BaseEntity,
    Collection,
    Entity,
    Enum,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OptionalProps,
    PrimaryKey,
    Property,
    Ref,
    types,
} from "@mikro-orm/core";
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

import { ProductCategory } from "./product-category.entity";
import { ProductTag } from "./product-tag.entity";
import { ProductVariant } from "./product-variant.entity";

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
        search: true, //default is true
        filter: true, //default is true
        sort: true, //default is true
        input: true, //default is true
    })
    title: string;

    @Property()
    @Field()
    visible: boolean;

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

    @OneToMany(() => ProductVariant, (variant) => variant.product, { orphanRemoval: true })
    @CrudField({
        resolveField: true, //default is true
        //search: true, //not yet implemented
        //filter: true, //not yet implemented
        //sort: true, //not yet implemented
        input: true, //default is true
    })
    variants = new Collection<ProductVariant>(this);

    @ManyToOne(() => ProductCategory, { nullable: true, ref: true })
    @CrudField({
        resolveField: true, //default is true
        search: true, //default is true
        filter: true, //default is true
        sort: true, //default is true
        input: true, //default is true
    })
    category?: Ref<ProductCategory>;

    @ManyToMany(() => ProductTag, "products", { owner: true })
    @CrudField({
        resolveField: true, //default is true
        //search: true, //not yet implemented
        //filter: true, //not yet implemented
        //sort: true, //not yet implemented
        input: true, //default is true
    })
    tags = new Collection<ProductTag>(this);

    @Property()
    @Field()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    @Field()
    updatedAt: Date = new Date();
}
