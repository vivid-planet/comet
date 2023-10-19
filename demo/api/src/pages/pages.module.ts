import { BlocksModule, DependenciesResolverFactory, RedirectsModule } from "@comet/cms-api";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { forwardRef, Module } from "@nestjs/common";
import { PagesEntityInfoService } from "@src/pages/pages-entity-info.service";

import { Page } from "./entities/page.entity";
import { PagesResolver } from "./pages.resolver";

@Module({
    imports: [MikroOrmModule.forFeature([Page]), forwardRef(() => BlocksModule), RedirectsModule],
    providers: [PagesResolver, DependenciesResolverFactory.create(Page), PagesEntityInfoService],
    exports: [MikroOrmModule],
})
export class PagesModule {}
