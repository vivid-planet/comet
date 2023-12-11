import { BlocksModule } from "@comet/cms-api";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { PagesModule } from "@src/pages/pages.module";

import { Link } from "./entities/link.entity";
import { LinksResolver } from "./links.resolver";

@Module({
    imports: [PagesModule, BlocksModule, MikroOrmModule.forFeature([Link])],
    providers: [LinksResolver],
    exports: [MikroOrmModule],
})
export class LinksModule {}
