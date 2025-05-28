import { CsvColumn, CsvColumnType } from "@comet/cms-api";
import { Collection, Ref } from "@mikro-orm/core";
import { IsArray, IsBoolean, IsDate, IsEnum, IsInt, IsOptional, IsString } from "class-validator";

import { ProductDimensions, ProductDiscounts, ProductPriceRange, ProductStatus } from "./entities/product.entity";
import { ProductCategory } from "./entities/product-category.entity";
import { ProductColor } from "./entities/product-color.entity";
import { ProductType } from "./entities/product-type.enum";

export class ProductImporterInput {
    @CsvColumn("title")
    @IsString()
    title: string;

    @CsvColumn("status")
    @IsEnum(ProductStatus)
    status: ProductStatus = ProductStatus.Unpublished;

    @CsvColumn("slug")
    @IsString()
    slug: string;

    @CsvColumn("long description")
    @IsString()
    description: string;

    @CsvColumn("type")
    @IsEnum(ProductType)
    type: ProductType;

    @CsvColumn("additionalTypes", {
        transform: (value: string) => (value ? value.split(",").map((type) => ProductType[type.trim() as keyof typeof ProductType]) : []),
    })
    @IsArray()
    @IsEnum(ProductType, { each: true })
    additionalTypes: ProductType[] = [];

    @CsvColumn("articleCategory")
    category?: Ref<ProductCategory> = undefined;

    @CsvColumn("price")
    @IsOptional()
    price?: number = undefined;

    @CsvColumn("priceRange")
    @IsOptional()
    priceRange?: ProductPriceRange = undefined;

    @CsvColumn("inStock", { type: CsvColumnType.Boolean, valueMapping: { true: true, false: false, "": false } })
    @IsBoolean()
    inStock: boolean = true;

    @CsvColumn("soldCount", { type: CsvColumnType.Integer })
    @IsOptional()
    @IsInt()
    soldCount?: number;

    @CsvColumn("availableSince", { type: CsvColumnType.DateTime, dateFormatString: "dd-MM-yyyy" })
    @IsOptional()
    @IsDate()
    availableSince?: Date = undefined; // use string in MikroORM v6 (https://mikro-orm.io/docs/upgrading-v5-to-v6#changes-in-date-property-mapping)

    @CsvColumn("lastCheckedAt", { type: CsvColumnType.DateTime, dateFormatString: "dd-MM-yyyy-HH:mm:ss" })
    @IsOptional()
    @IsDate()
    lastCheckedAt?: Date = undefined;

    @CsvColumn("image")
    image: string;

    @CsvColumn("discounts")
    @IsOptional()
    discounts?: ProductDiscounts[] = [];

    @CsvColumn("articleNumbers", { transform: (value: string) => (value ? value.split(",").map((articleNumber) => articleNumber.trim()) : []) })
    @IsArray()
    @IsString({ each: true })
    articleNumbers?: string[] = [];

    @CsvColumn("dimensions")
    @IsOptional()
    dimensions?: ProductDimensions = undefined;

    @CsvColumn("colors")
    colors = new Collection<ProductColor>(this);
}
