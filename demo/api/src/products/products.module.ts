import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { Manufacturer } from "@src/products/entities/manufacturer.entity";
import { ManufacturerResolver } from "@src/products/generated/manufacturer.resolver";
import { ManufacturersService } from "@src/products/generated/manufacturers.service";

import { Product } from "./entities/product.entity";
import { ProductCategory } from "./entities/product-category.entity";
import { ProductStatistics } from "./entities/product-statistics.entity";
import { ProductTag } from "./entities/product-tag.entity";
import { ProductVariant } from "./entities/product-variant.entity";
import { ProductResolver } from "./generated/product.resolver";
import { ProductCategoriesService } from "./generated/product-categories.service";
import { ProductCategoryResolver } from "./generated/product-category.resolver";
import { ProductTagResolver } from "./generated/product-tag.resolver";
import { ProductTagsService } from "./generated/product-tags.service";
import { ProductsService } from "./generated/products.service";

@Module({
    imports: [MikroOrmModule.forFeature([Product, ProductCategory, ProductTag, ProductVariant, ProductStatistics, Manufacturer])],
    providers: [
        ProductResolver,
        ProductsService,
        ProductCategoryResolver,
        ProductCategoriesService,
        ProductTagResolver,
        ProductTagsService,
        ManufacturerResolver,
        ManufacturersService,
    ],
    exports: [],
})
export class ProductsModule {}
