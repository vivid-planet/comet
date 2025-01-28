import { DependenciesModule } from "@comet/cms-api";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@src/config/config.module";
import { FixturesConsole } from "@src/db/fixtures/fixtures.console";
import { Link } from "@src/documents/links/entities/link.entity";
import { LinksModule } from "@src/documents/links/links.module";
import { Page } from "@src/documents/pages/entities/page.entity";
import { PagesModule } from "@src/documents/pages/pages.module";
import { Manufacturer } from "@src/products/entities/manufacturer.entity";
import { Product } from "@src/products/entities/product.entity";
import { ConsoleModule } from "nestjs-console";

import { FileUploadsFixtureService } from "./generators/file-uploads-fixture.service";
import { ImageFileFixtureService } from "./generators/image-file-fixture.service";
import { ManyImagesTestPageFixtureService } from "./generators/many-images-test-page-fixture.service";
import { ProductsFixtureService } from "./generators/products-fixture.service";
import { RedirectsFixtureService } from "./generators/redirects-fixture.service";
import { SvgImageFileFixtureService } from "./generators/svg-image-file-fixture.service";

@Module({
    imports: [
        ConfigModule,
        ConsoleModule,
        PagesModule,
        LinksModule,
        DependenciesModule,
        MikroOrmModule.forFeature([Page, Link, Product, Manufacturer]),
    ],
    providers: [
        FixturesConsole,
        ManyImagesTestPageFixtureService,
        ImageFileFixtureService,
        SvgImageFileFixtureService,
        FileUploadsFixtureService,
        RedirectsFixtureService,
        ProductsFixtureService,
    ],
})
export class FixturesModule {}
