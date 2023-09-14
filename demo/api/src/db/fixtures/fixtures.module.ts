import { Module } from "@nestjs/common";
import { ConfigModule } from "@src/config/config.module";
import { FixturesConsole } from "@src/db/fixtures/fixtures.console";
import { ImageGeneratorService } from "@src/db/fixtures/generators/image-generator.service";
import { LinksModule } from "@src/links/links.module";
import { PagesModule } from "@src/pages/pages.module";
import { ConsoleModule } from "nestjs-console";

import { LinkGeneratorService } from "./generators/link-generator.service";
import { PageGeneratorService } from "./generators/page-generator.service";

@Module({
    imports: [ConfigModule, ConsoleModule, PagesModule, LinksModule],
    providers: [FixturesConsole, PageGeneratorService, LinkGeneratorService, ImageGeneratorService],
})
export class FixturesModule {}
