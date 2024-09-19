import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { PagesModule } from "@src/pages/pages.module";

import { PredefinedPage } from "./entities/predefined-page.entity";
import { PredefinedPageResolver } from "./predefined-page.resolver";

@Module({
    imports: [PagesModule, MikroOrmModule.forFeature([PredefinedPage])],
    providers: [PredefinedPageResolver],
})
export class PredefinedPageModule {}
