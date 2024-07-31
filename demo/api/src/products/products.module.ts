import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { Manufacturer } from "./entities/manufacturer.entity";
import { ManufacturerCountry } from "./entities/manufacturer-country.entity";
import { Product } from "./entities/product.entity";
import { ProductCategory } from "./entities/product-category.entity";
import { ProductColor } from "./entities/product-color.entity";
import { ProductStatistics } from "./entities/product-statistics.entity";
import { ProductTag } from "./entities/product-tag.entity";
import { ProductToTag } from "./entities/product-to-tag.entity";
import { ProductVariant } from "./entities/product-variant.entity";
import { ManufacturerResolver } from "./generated/manufacturer.resolver";
import { ManufacturerCountryResolver } from "./generated/manufacturer-country.resolver";
import { ProductResolver } from "./generated/product.resolver";
import { ProductCategoriesService } from "./generated/product-categories.service";
import { ProductCategoryResolver } from "./generated/product-category.resolver";
import { ProductTagResolver } from "./generated/product-tag.resolver";
import { ProductToTagResolver } from "./generated/product-to-tag.resolver";
import { ProductVariantResolver } from "./generated/product-variant.resolver";

@Module({
    imports: [
        MikroOrmModule.forFeature([
            Product,
            ProductCategory,
            ProductTag,
            ProductToTag,
            ProductVariant,
            ProductStatistics,
            ProductColor,
            Manufacturer,
            ManufacturerCountry,
        ]),
    ],
    providers: [
        ProductResolver,
        ProductCategoryResolver,
        ProductCategoriesService,
        ProductTagResolver,
        ProductVariantResolver,
        ManufacturerResolver,
        ManufacturerCountryResolver,
        ProductToTagResolver,
    ],
    exports: [],
})
export class ProductsModule {}
