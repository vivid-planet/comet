import { AttachedDocument } from "@comet/cms-api";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@src/config/config.module";
import { FixturesCommand } from "@src/db/fixtures/fixtures.command";
import { Manufacturer } from "@src/products/entities/manufacturer.entity";
import { Product } from "@src/products/entities/product.entity";
import { ProductCategory } from "@src/products/entities/product-category.entity";
import { ProductCategoryType } from "@src/products/entities/product-category-type.entity";

import { FileUploadsFixtureService } from "./generators/file-uploads-fixture.service";
import { ProductsFixtureService } from "./generators/products-fixture.service";

@Module({
    imports: [ConfigModule, MikroOrmModule.forFeature([Product, ProductCategory, ProductCategoryType, Manufacturer, AttachedDocument])],
    providers: [FixturesCommand, FileUploadsFixtureService, ProductsFixtureService],
})
export class FixturesModule {}
