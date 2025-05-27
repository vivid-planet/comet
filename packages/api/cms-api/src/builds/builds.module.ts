import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { BuildTemplatesResolver } from "./build-templates.resolver";
import { BuildTemplatesService } from "./build-templates.service";
import { BuildsResolver } from "./builds.resolver";
import { BuildsService } from "./builds.service";
import { ChangesCheckerCommand } from "./changes-checker.command";
import { ChangesCheckerInterceptor } from "./changes-checker.interceptor";
import { ChangesSinceLastBuild } from "./entities/changes-since-last-build.entity";

@Module({
    imports: [MikroOrmModule.forFeature([ChangesSinceLastBuild])],
    providers: [
        BuildTemplatesResolver,
        BuildTemplatesService,
        BuildsResolver,
        BuildsService,
        {
            provide: "APP_INTERCEPTOR",
            useClass: ChangesCheckerInterceptor,
        },
        ChangesCheckerCommand,
    ],
    exports: [BuildsService],
})
export class BuildsModule {}
