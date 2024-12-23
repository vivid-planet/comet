import { DependenciesModule } from "@comet/cms-api";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@src/config/config.module";
import { FixturesConsole } from "@src/db/fixtures/fixtures.console";
import { LinksModule } from "@src/documents/links/links.module";
import { PagesModule } from "@src/documents/pages/pages.module";
import { ConsoleModule } from "nestjs-console";

import { FileUploadsFixtureService } from "./generators/file-uploads-fixture.service";
import { ImageFileFixtureService } from "./generators/image-file-fixture.service";
import { ManyImagesTestPageFixtureService } from "./generators/many-images-test-page-fixture.service";
import { RedirectsFixtureService } from "./generators/redirects-fixture.service";
import { SvgImageFileFixtureService } from "./generators/svg-image-file-fixture.service";

@Module({
    imports: [ConfigModule, ConsoleModule, PagesModule, LinksModule, DependenciesModule],
    providers: [
        FixturesConsole,
        ManyImagesTestPageFixtureService,
        ImageFileFixtureService,
        SvgImageFileFixtureService,
        FileUploadsFixtureService,
        RedirectsFixtureService,
    ],
})
export class FixturesModule {}
