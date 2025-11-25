import { AttachedDocument, DependenciesModule } from "@comet/cms-api";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@src/config/config.module";
import { DamFile } from "@src/dam/entities/dam-file.entity";
import { FixturesCommand } from "@src/db/fixtures/fixtures.command";
import { Manufacturer } from "@src/products/entities/manufacturer.entity";
import { Product } from "@src/products/entities/product.entity";
import { ProductCategory } from "@src/products/entities/product-category.entity";
import { ProductCategoryType } from "@src/products/entities/product-category-type.entity";

import { DamImageBlockFixtureService } from "./generators/blocks/media/dam-image-block-fixture.service";
import { PixelImageBlockFixtureService } from "./generators/blocks/media/pixel-image-block-fixture.service";
import { SvgImageBlockFixtureService } from "./generators/blocks/media/svg-image-block-fixture.service";
import { FileUploadsFixtureService } from "./generators/file-uploads-fixture.service";
import { ImageFixtureService } from "./generators/image-fixture.service";
import { NewsFixtureService } from "./generators/news-fixture.service";
import { ProductsFixtureService } from "./generators/products-fixture.service";
import { SvgImageFileFixtureService } from "./generators/svg-image-file-fixture.service";
import { VideoFixtureService } from "./generators/video-fixture.service";

@Module({
    imports: [
        ConfigModule,
        DependenciesModule,
        MikroOrmModule.forFeature([DamFile, Product, ProductCategory, ProductCategoryType, Manufacturer, AttachedDocument]),
    ],
    providers: [
        FixturesCommand,
        FileUploadsFixtureService,
        ProductsFixtureService,
        ImageFixtureService,
        SvgImageBlockFixtureService,
        SvgImageFileFixtureService,
        VideoFixtureService,
        NewsFixtureService,
        DamImageBlockFixtureService,
        PixelImageBlockFixtureService,
        SvgImageBlockFixtureService,
    ],
})
export class FixturesModule {}
