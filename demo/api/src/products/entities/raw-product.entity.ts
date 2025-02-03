import { Entity, Enum, ManyToOne, Property, Ref, types } from "@mikro-orm/core";
import { CsvColumn } from "@src/importer/decorators/csv-column.decorator";
import { TargetEntity } from "@src/importer/decorators/target-entity.decorator";
import { BaseTargetEntity } from "@src/importer/entities/base-target.entity";
import { Manufacturer } from "@src/products/entities/manufacturer.entity";
import { IsArray, IsBoolean, IsDate, IsEnum, IsInt, IsOptional, IsString } from "class-validator";

import { ProductDimensions, ProductDiscounts, ProductPriceRange, ProductStatus } from "./product.entity";
import { ProductType } from "./product-type.enum";

@Entity()
@TargetEntity()
export class RawProduct extends BaseTargetEntity {
    @Property()
    @CsvColumn("title")
    @IsString()
    title: string;

    @Enum({ items: () => ProductStatus })
    @CsvColumn("status")
    @IsEnum(ProductStatus)
    status: ProductStatus = ProductStatus.Unpublished;

    @Property()
    @CsvColumn("slug")
    @IsString()
    slug: string;

    @Property()
    @CsvColumn("long description")
    @IsString()
    description: string;

    @Enum({ items: () => ProductType })
    @CsvColumn("type")
    @IsEnum(ProductType)
    type: ProductType;

    @Enum({ items: () => ProductType, array: true })
    @CsvColumn("additionalTypes")
    @IsArray()
    @IsEnum(ProductType, { each: true })
    additionalTypes: ProductType[] = [];

    @Property({ type: types.decimal, nullable: true })
    @CsvColumn("price")
    @IsOptional()
    price?: string = undefined;

    @Property({ type: "json", nullable: true })
    @CsvColumn("priceRange")
    @IsOptional()
    priceRange?: ProductPriceRange = undefined;

    @Property({ type: types.boolean })
    @CsvColumn("inStock", { valueMapping: { true: true, false: false, "": false } })
    @IsBoolean()
    inStock: boolean = true;

    @Property({ type: types.integer, nullable: true })
    @CsvColumn("soldCount")
    @IsOptional()
    @IsInt()
    soldCount?: number;

    @Property({ type: types.date, nullable: true })
    @CsvColumn("availableSince", { dateFormatString: "dd-MM-yyyy" })
    @IsOptional()
    @IsDate()
    availableSince?: Date = undefined; // use string in MikroORM v6 (https://mikro-orm.io/docs/upgrading-v5-to-v6#changes-in-date-property-mapping)

    @Property({ nullable: true })
    @CsvColumn("lastCheckedAt", { dateFormatString: "dd-MM-yyyy-HH:mm:ss" })
    @IsOptional()
    @IsDate()
    lastCheckedAt?: Date = undefined;

    @Property()
    @CsvColumn("image")
    image: string;

    @Property()
    @CsvColumn("discounts")
    @IsOptional()
    discounts?: ProductDiscounts[] = [];

    @Property()
    @CsvColumn("articleNumbers")
    @IsArray()
    @IsString({ each: true })
    articleNumbers?: string[] = [];

    @Property()
    @IsOptional()
    @CsvColumn("articleCategory")
    category?: string;

    @Property({ type: "json", nullable: true })
    @CsvColumn("dimensions")
    @IsOptional()
    dimensions?: ProductDimensions = undefined;

    @Property()
    @CsvColumn("colors")
    colors: string[] = [];

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();

    @ManyToOne(() => Manufacturer, { nullable: true, index: true, ref: true })
    @IsOptional()
    manufacturer?: Ref<Manufacturer> = undefined;
}
