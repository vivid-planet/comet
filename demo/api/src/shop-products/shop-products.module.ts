import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { ShopProduct } from "@src/shop-products/entities/shop-product.entity";
import { ShopProductVariant } from "@src/shop-products/entities/shop-product-variant.entity";
import { ShopProductResolver } from "@src/shop-products/generated/shop-product.resolver";
import { ShopProductVariantResolver } from "@src/shop-products/generated/shop-product-variant.resolver";
import { ShopProductVariantsService } from "@src/shop-products/generated/shop-product-variants.service";
import { ShopProductsService } from "@src/shop-products/generated/shop-products.service";

@Module({
    imports: [MikroOrmModule.forFeature([ShopProduct, ShopProductVariant])],
    providers: [ShopProductResolver, ShopProductsService, ShopProductVariantsService, ShopProductVariantResolver],
})
export class ShopProductsModule {}
