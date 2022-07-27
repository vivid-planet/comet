import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { Product } from "./entities/product.entity";
import { ProductCrudResolver } from "./generated/product.crud.resolver";
import { ProductsService } from "./generated/products.service";

@Module({
    imports: [MikroOrmModule.forFeature([Product])],
    providers: [ProductCrudResolver, ProductsService],
    exports: [],
})
export class ProductsModule {}
