import { Module } from "@nestjs/common";
import { ConfigModule } from "@src/config/config.module";
import { FixturesConsole } from "@src/db/fixtures/fixtures.console";
import { DocumentGeneratorService } from "@src/db/fixtures/generators/document-generator.service";
import { ImageGeneratorService } from "@src/db/fixtures/generators/image-generator.service";
import { LinksModule } from "@src/links/links.module";
import { PagesModule } from "@src/pages/pages.module";
import { ConsoleModule } from "nestjs-console";

@Module({
    imports: [ConfigModule, ConsoleModule, PagesModule, LinksModule],
    providers: [FixturesConsole, DocumentGeneratorService, ImageGeneratorService],
})
export class FixturesModule {}
