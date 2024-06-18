import { BlockDataInterface, RootBlock, RootBlockEntity } from "@comet/blocks-api";
import { CrudField, CrudGenerator, DamImageBlock, PublicUpload, RootBlockDataScalar, RootBlockType } from "@comet/cms-api";
import {
    BaseEntity,
    Collection,
    Entity,
    Enum,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    OptionalProps,
    PrimaryKey,
    Property,
    Ref,
    types,
} from "@mikro-orm/core";
import { Field, ID, InputType, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Manufacturer } from "@src/products/entities/manufacturer.entity";
import { IsNumber } from "class-validator";
import { v4 as uuid } from "uuid";

import { ProductCategory } from "./product-category.entity";
import { ProductColor } from "./product-color.entity";
import { ProductStatistics } from "./product-statistics.entity";
import { ProductTag } from "./product-tag.entity";
import { ProductToTag } from "./product-to-tag.entity";
import { ProductType } from "./product-type.enum";
import { ProductVariant } from "./product-variant.entity";

export enum ProductStatus {
    Published = "Published",
    Unpublished = "Unpublished",
    Deleted = "Deleted",
}
registerEnumType(ProductStatus, { name: "ProductStatus" });

@ObjectType()
@InputType("ProductDiscountsInput")
export class ProductDiscounts {
    @Field()
    @IsNumber()
    quantity: number;

    @Field()
    @IsNumber()
    price: number;
}

@ObjectType()
@InputType("ProductDimensionsInput")
export class ProductDimensions {
    @Field()
    @IsNumber()
    width: number;

    @Field()
    @IsNumber()
    height: number;

    @Field()
    @IsNumber()
    depth: number;
}

@ObjectType()
@Entity()
@RootBlockEntity<Product>({ isVisible: (product) => product.status === ProductStatus.Published })
@CrudGenerator({ targetDirectory: `${__dirname}/../generated/` })
export class Product extends BaseEntity<Product, "id"> {
    [OptionalProps]?: "createdAt" | "updatedAt" | "status";

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

    @Enum({ items: () => ProductStatus })
    @Field(() => ProductStatus)
    status: ProductStatus = ProductStatus.Unpublished;

    @Property()
    @Field()
    slug: string;

    @Property()
    @Field()
    description: string;

    @Enum({ items: () => ProductType })
    @Field(() => ProductType)
    type: ProductType;

    @Field(() => [ProductType])
    @Enum({ items: () => ProductType, array: true })
    additionalTypes: ProductType[] = [];

    @Property({ type: types.decimal, nullable: true })
    @Field({ nullable: true })
    price?: number = undefined;

    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    @Property({ type: types.boolean })
    @Field()
    inStock: boolean = true;

    @Property({ type: types.decimal, nullable: true })
    @Field(() => Int, { nullable: true })
    @CrudField({
        input: false,
    })
    soldCount?: number;

    @Property({ type: types.date, nullable: true })
    @Field({ nullable: true })
    availableSince?: Date = undefined;

    @Property({ customType: new RootBlockType(DamImageBlock) })
    @Field(() => RootBlockDataScalar(DamImageBlock))
    @RootBlock(DamImageBlock)
    image: BlockDataInterface;

    @Property({ type: "json" })
    @Field(() => [ProductDiscounts])
    discounts?: ProductDiscounts[] = [];

    @Property({ type: "json" })
    @Field(() => [String])
    articleNumbers?: string[] = [];

    @Property({ type: "json", nullable: true })
    @Field(() => ProductDimensions, { nullable: true })
    dimensions?: ProductDimensions = undefined;

    @OneToOne(() => ProductStatistics, { inversedBy: "product", owner: true, ref: true, nullable: true })
    @Field(() => ProductStatistics, { nullable: true })
    statistics?: Ref<ProductStatistics> = undefined;

    @OneToMany(() => ProductColor, (variant) => variant.product, { orphanRemoval: true })
    @CrudField({
        resolveField: true, //default is true
        //search: true, //not yet implemented
        //filter: true, //not yet implemented
        //sort: true, //not yet implemented
        input: true, //default is true
    })
    colors = new Collection<ProductColor>(this);

    @OneToMany(() => ProductVariant, (variant) => variant.product, { orphanRemoval: true })
    @CrudField({
        resolveField: true, //default is true
        //search: true, //not yet implemented
        //filter: true, //not yet implemented
        //sort: true, //not yet implemented
        input: false, //default is true, disabled here because it is edited using it's own crud api
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
    category?: Ref<ProductCategory> = undefined;

    @ManyToMany(() => ProductTag, "products", { owner: true })
    @CrudField({
        resolveField: true, //default is true
        //search: true, //not yet implemented
        //filter: true, //not yet implemented
        //sort: true, //not yet implemented
        input: true, //default is true
    })
    tags = new Collection<ProductTag>(this);

    @OneToMany(() => ProductToTag, (productToTag) => productToTag.product, { orphanRemoval: true })
    tagsWithStatus = new Collection<ProductToTag>(this);

    @Property()
    @Field()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    @Field()
    updatedAt: Date = new Date();

    @ManyToOne(() => Manufacturer, { nullable: true, index: true, ref: true })
    manufacturer?: Ref<Manufacturer> = undefined;

    @ManyToOne(() => PublicUpload, { nullable: true, ref: true })
    @Field(() => PublicUpload, { nullable: true })
    factsheet?: Ref<PublicUpload> = undefined;

    @ManyToMany(() => PublicUpload)
    @Field(() => [PublicUpload])
    datasheets = new Collection<PublicUpload>(this);
}
