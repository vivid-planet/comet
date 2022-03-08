import { BlocksModule, RedirectsModule } from "@comet/api-cms";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { forwardRef, Module } from "@nestjs/common";

import { Page } from "./entities/page.entity";
import { PagesResolver } from "./pages.resolver";

@Module({
    imports: [MikroOrmModule.forFeature([Page]), forwardRef(() => BlocksModule), RedirectsModule],
    providers: [PagesResolver],
    exports: [MikroOrmModule],
})
export class PagesModule {}
