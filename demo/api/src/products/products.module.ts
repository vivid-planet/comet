import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { Product } from "./entities/product.entity";
import { ProductCategory } from "./entities/product-category.entity";
import { ProductTag } from "./entities/product-tag.entity";
import { ProductCrudResolver } from "./generated/product.crud.resolver";
import { ProductCategoriesService } from "./generated/product-categories.service";
import { ProductCategoryCrudResolver } from "./generated/product-category.crud.resolver";
import { ProductTagCrudResolver } from "./generated/product-tag.crud.resolver";
import { ProductTagsService } from "./generated/product-tags.service";
import { ProductsService } from "./generated/products.service";

@Module({
    imports: [MikroOrmModule.forFeature([Product, ProductCategory, ProductTag])],
    providers: [
        ProductCrudResolver,
        ProductsService,
        ProductCategoryCrudResolver,
        ProductCategoriesService,
        ProductTagCrudResolver,
        ProductTagsService,
    ],
    exports: [],
})
export class ProductsModule {}
