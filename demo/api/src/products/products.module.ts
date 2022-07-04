import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { Product } from "./entities/product.entity";
import { ProductsResolver } from "./products.resolver";
import { ProductsService } from "./products.service";

@Module({
    imports: [MikroOrmModule.forFeature([Product])],
    providers: [ProductsService, ProductsResolver],
    exports: [ProductsService],
})
export class ProductsModule {}
