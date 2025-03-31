import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { PredefinedPage } from "./entities/predefined-page.entity";
import { PredefinedPagesResolver } from "./predefined-pages.resolver";
import { PredefinedPagesService } from "./predefined-pages.service";

@Module({
    imports: [MikroOrmModule.forFeature([PredefinedPage])],
    providers: [PredefinedPagesResolver, PredefinedPagesService],
    exports: [PredefinedPagesService],
})
export class PredefinedPagesModule {}
