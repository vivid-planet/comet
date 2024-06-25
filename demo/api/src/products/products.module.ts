import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { Manufacturer } from "@src/products/entities/manufacturer.entity";
import { ManufacturerCountry } from "@src/products/entities/manufacturer-country.entity";
import { ManufacturerResolver } from "@src/products/generated/manufacturer.resolver";
import { ManufacturerCountriesService } from "@src/products/generated/manufacturer-countries.service";
import { ManufacturerCountryResolver } from "@src/products/generated/manufacturer-country.resolver";
import { ManufacturersService } from "@src/products/generated/manufacturers.service";

import { Product } from "./entities/product.entity";
import { ProductCategory } from "./entities/product-category.entity";
import { ProductColor } from "./entities/product-color.entity";
import { ProductStatistics } from "./entities/product-statistics.entity";
import { ProductTag } from "./entities/product-tag.entity";
import { ProductToTag } from "./entities/product-to-tag.entity";
import { ProductVariant } from "./entities/product-variant.entity";
import { ProductResolver } from "./generated/product.resolver";
import { ProductCategoriesService } from "./generated/product-categories.service";
import { ProductCategoryResolver } from "./generated/product-category.resolver";
import { ProductTagResolver } from "./generated/product-tag.resolver";
import { ProductTagsService } from "./generated/product-tags.service";
import { ProductToTagResolver } from "./generated/product-to-tag.resolver";
import { ProductVariantResolver } from "./generated/product-variant.resolver";
import { ProductVariantsService } from "./generated/product-variants.service";
import { ProductsService } from "./generated/products.service";

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
        ProductsService,
        ProductCategoryResolver,
        ProductCategoriesService,
        ProductTagResolver,
        ProductTagsService,
        ProductVariantsService,
        ProductVariantResolver,
        ManufacturerResolver,
        ManufacturersService,
        ManufacturerCountryResolver,
        ManufacturerCountriesService,
        ProductToTagResolver,
    ],
    exports: [],
})
export class ProductsModule {}
