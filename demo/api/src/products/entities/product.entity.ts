import { BlockDataInterface, RootBlock, RootBlockEntity } from "@comet/blocks-api";
import { CrudField, CrudGenerator, DamImageBlock, FileUpload, RootBlockType } from "@comet/cms-api";
import { Collection, Entity, Enum, ManyToMany, ManyToOne, OneToMany, OneToOne, OptionalProps, Property, Ref, types } from "@mikro-orm/core";
import { Field, InputType, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { BaseImportTargetEntity } from "@src/importer/entities/base-import-target.entity";
import { Manufacturer } from "@src/products/entities/manufacturer.entity";
import { IsNumber } from "class-validator";
import { GraphQLDate } from "graphql-scalars";

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
@InputType("ProductPriceRangeInput")
export class ProductPriceRange {
    @Field()
    @IsNumber()
    min: number;

    @Field()
    @IsNumber()
    max: number;
}

@ObjectType()
@Entity()
@RootBlockEntity<Product>({ isVisible: (product) => product.status === ProductStatus.Published })
@CrudGenerator({ targetDirectory: `${__dirname}/../generated/` })
export class Product extends BaseImportTargetEntity<Product, "id"> {
    [OptionalProps]?: "createdAt" | "updatedAt" | "status";

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

    @Property({ type: "json", nullable: true })
    @Field(() => ProductPriceRange, { nullable: true })
    priceRange?: ProductPriceRange = undefined;

    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    @Property({ type: types.boolean })
    @Field()
    inStock: boolean = true;

    @Property({ type: types.integer, nullable: true })
    @Field(() => Int, { nullable: true })
    @CrudField({
        input: false,
    })
    soldCount?: number;

    @Property({ type: types.date, nullable: true })
    @Field(() => GraphQLDate, { nullable: true })
    availableSince?: Date = undefined; // use string in MikroORM v6 (https://mikro-orm.io/docs/upgrading-v5-to-v6#changes-in-date-property-mapping)

    @Property({ nullable: true })
    @Field({ nullable: true })
    lastCheckedAt?: Date = undefined;

    @Property({ customType: new RootBlockType(DamImageBlock) })
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

    @ManyToOne(() => FileUpload, { nullable: true, ref: true })
    @Field(() => FileUpload, { nullable: true })
    priceList?: Ref<FileUpload> = undefined;

    @ManyToMany(() => FileUpload)
    @Field(() => [FileUpload])
    datasheets = new Collection<FileUpload>(this);
}
