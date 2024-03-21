import { Module } from "@nestjs/common";
import { ConfigModule } from "@src/config/config.module";
import { FixturesConsole } from "@src/db/fixtures/fixtures.console";
import { LinksModule } from "@src/links/links.module";
import { PagesModule } from "@src/pages/pages.module";
import { ConsoleModule } from "nestjs-console";

import { ManyImagesTestPageFixtureService } from "./generators/many-images-test-page-fixture.service";
import { PublicUploadsFixtureService } from "./generators/public-uploads-fixture.service";
import { SvgImageFileFixtureService } from "./generators/svg-image-file-fixture.service";
import { UnsplashImageFileFixtureService } from "./generators/unsplash-image-file-fixture.service";

@Module({
    imports: [ConfigModule, ConsoleModule, PagesModule, LinksModule],
    providers: [
        FixturesConsole,
        ManyImagesTestPageFixtureService,
        UnsplashImageFileFixtureService,
        SvgImageFileFixtureService,
        PublicUploadsFixtureService,
    ],
})
export class FixturesModule {}
