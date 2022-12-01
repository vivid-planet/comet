import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { BuildTemplatesResolver } from "./build-templates.resolver";
import { BuildTemplatesService } from "./build-templates.service";
import { BuildsResolver } from "./builds.resolver";
import { BuildsService } from "./builds.service";
import { ChangesCheckerConsole } from "./changes-checker.console";
import { ChangesSinceLastBuild } from "./entities/changes-since-last-build.entity";
import { SkipBuildInterceptor } from "./skip-build.interceptor";

@Module({
    imports: [MikroOrmModule.forFeature([ChangesSinceLastBuild])],
    providers: [
        BuildTemplatesResolver,
        BuildTemplatesService,
        BuildsResolver,
        BuildsService,
        {
            provide: "APP_INTERCEPTOR",
            useClass: SkipBuildInterceptor,
        },
        ChangesCheckerConsole,
    ],
    exports: [BuildsService],
})
export class BuildsModule {}
