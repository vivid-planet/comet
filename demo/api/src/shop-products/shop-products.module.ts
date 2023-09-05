import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { ShopProduct } from "@src/shop-products/entities/shop-product.entity";
import { ShopProductCategory } from "@src/shop-products/entities/shop-product-category.entitiy";
import { ShopProductVariant } from "@src/shop-products/entities/shop-product-variant.entity";
import { ShopProductResolver } from "@src/shop-products/generated/shop-product.resolver";
import { ShopProductCategoriesService } from "@src/shop-products/generated/shop-product-categories.service";
import { ShopProductCategoryResolver } from "@src/shop-products/generated/shop-product-category.resolver";
import { ShopProductVariantResolver } from "@src/shop-products/generated/shop-product-variant.resolver";
import { ShopProductVariantsService } from "@src/shop-products/generated/shop-product-variants.service";
import { ShopProductsService } from "@src/shop-products/generated/shop-products.service";

@Module({
    imports: [MikroOrmModule.forFeature([ShopProduct, ShopProductVariant, ShopProductCategory])],
    providers: [
        ShopProductResolver,
        ShopProductsService,
        ShopProductVariantsService,
        ShopProductVariantResolver,
        ShopProductCategoryResolver,
        ShopProductCategoriesService,
    ],
})
export class ShopProductsModule {}
