import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { PredefinedPage } from "./entities/predefined-page.entity";
import { PredefinedPagesResolver } from "./predefined-pages.resolver";

@Module({
    imports: [MikroOrmModule.forFeature([PredefinedPage])],
    providers: [PredefinedPagesResolver],
})
export class PredefinedPagesModule {}
