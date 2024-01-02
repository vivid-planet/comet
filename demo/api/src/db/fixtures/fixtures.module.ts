import { Module } from "@nestjs/common";
import { ConfigModule } from "@src/config/config.module";
import { FixturesConsole } from "@src/db/fixtures/fixtures.console";
import { ImageFixtureService } from "@src/db/fixtures/generators/image-fixture.service";
import { LinksModule } from "@src/links/links.module";
import { PagesModule } from "@src/pages/pages.module";
import { ConsoleModule } from "nestjs-console";

import { LinkFixtureService } from "./generators/link-fixture.service";
import { PageFixtureService } from "./generators/page-fixture.service";
import { PublicUploadsFixtureService } from "./generators/public-uploads-fixture.service";

@Module({
    imports: [ConfigModule, ConsoleModule, PagesModule, LinksModule],
    providers: [FixturesConsole, PageFixtureService, LinkFixtureService, ImageFixtureService, PublicUploadsFixtureService],
})
export class FixturesModule {}
