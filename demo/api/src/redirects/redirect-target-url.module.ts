import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { PredefinedPagesModule } from "@src/documents/predefined-pages/predefined-pages.module";
import { News } from "@src/news/entities/news.entity";

import { RedirectTargetUrlService } from "./redirect-target-url.service";

@Module({
    imports: [MikroOrmModule.forFeature([News]), PredefinedPagesModule],
    providers: [RedirectTargetUrlService],
    exports: [RedirectTargetUrlService],
})
export class RedirectTargetUrlModule {}
