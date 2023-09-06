import { Module } from "@nestjs/common";
import { ConfigModule } from "@src/config/config.module";
import { FixturesConsole } from "@src/db/fixtures/fixtures.console";
import { LinksModule } from "@src/links/links.module";
import { PagesModule } from "@src/pages/pages.module";
import { ShopProductsModule } from "@src/shop-products/shop-products.module";
import { ConsoleModule } from "nestjs-console";

@Module({
    imports: [ConfigModule, ConsoleModule, PagesModule, LinksModule, ShopProductsModule],
    providers: [FixturesConsole],
})
export class FixturesModule {}
