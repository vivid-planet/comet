import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { Product } from "./entities/product.entity";
import { ProductCrudResolver } from "./generated/product.crud.resolver";

@Module({
    imports: [MikroOrmModule.forFeature([Product])],
    providers: [ProductCrudResolver],
    exports: [],
})
export class ProductsModule {}
