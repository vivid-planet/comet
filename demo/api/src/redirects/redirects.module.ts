import { AutoCreatorService } from "@comet/cms-api";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { Redirect } from "./entities/redirect.entity";
import { RedirectCrudResolver } from "./generated/redirect.crud.resolver";
import { RedirectsService } from "./generated/redirects.service";

@Module({
    imports: [MikroOrmModule.forFeature([Redirect])],
    providers: [RedirectCrudResolver, RedirectsService, AutoCreatorService],
    exports: [],
})
export class RedirectsModule {}
