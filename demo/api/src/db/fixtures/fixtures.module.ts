import { Module } from "@nestjs/common";
import { ConfigModule } from "@src/config/config.module";
import { FixturesConsole } from "@src/db/fixtures/fixtures.console";
import { LinksModule } from "@src/links/links.module";
import { PagesModule } from "@src/pages/pages.module";
import { ConsoleModule } from "nestjs-console";

import { PublicUploadsFixtureService } from "./generators/public-uploads-fixture.service";

@Module({
    imports: [ConfigModule, ConsoleModule, PagesModule, LinksModule],
    providers: [FixturesConsole, PublicUploadsFixtureService],
})
export class FixturesModule {}
