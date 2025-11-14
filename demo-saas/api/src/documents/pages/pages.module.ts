import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { Page } from "./entities/page.entity";
import { PagesResolver } from "./pages.resolver";

@Module({
    imports: [MikroOrmModule.forFeature([Page])],
    providers: [PagesResolver],
})
export class PagesModule {}
