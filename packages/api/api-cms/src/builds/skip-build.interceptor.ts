import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable } from "rxjs";

import { BuildsService } from "./builds.service";
import { SKIP_BUILD_METADATA_KEY } from "./skip-build.decorator";

@Injectable()
export class SkipBuildInterceptor implements NestInterceptor {
    constructor(private reflector: Reflector, private readonly buildsService: BuildsService) {}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        if (context.getType().toString() === "graphql") {
            const gqlContext = GqlExecutionContext.create(context);
            if (gqlContext.getInfo().operation.operation === "mutation") {
                const skipBuild =
                    this.reflector.get<string[]>(SKIP_BUILD_METADATA_KEY, context.getHandler()) ||
                    this.reflector.get<string[]>(SKIP_BUILD_METADATA_KEY, context.getClass());

                if (!skipBuild) {
                    await this.buildsService.setChangesSinceLastBuild();
                }
            }
        }

        return next.handle();
    }
}
