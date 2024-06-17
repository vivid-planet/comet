import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { Product } from "./entities/product.entity";
import { ProductCategory } from "./entities/product-category.entity";
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
import { ProductsService } from "./generated/products.service";

@Module({
    imports: [MikroOrmModule.forFeature([Product, ProductCategory, ProductTag, ProductToTag, ProductVariant, ProductStatistics])],
    providers: [
        ProductResolver,
        ProductsService,
        ProductCategoryResolver,
        ProductCategoriesService,
        ProductTagResolver,
        ProductTagsService,
        ProductToTagResolver,
    ],
    exports: [],
})
export class ProductsModule {}
