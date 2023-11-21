import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { GraphQLResolveInfo } from "graphql";
import { Observable } from "rxjs";
import { ContentScope } from "src/user-permissions/interfaces/content-scope.interface";

import { ContentScopeService } from "../user-permissions/content-scope.service";
import { BuildsService } from "./builds.service";
import { SKIP_BUILD_METADATA_KEY } from "./skip-build.decorator";

@Injectable()
export class ChangesCheckerInterceptor implements NestInterceptor {
    constructor(
        private reflector: Reflector,
        private readonly buildsService: BuildsService,
        private readonly contentScopeService: ContentScopeService,
    ) {}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        if (context.getType().toString() === "graphql") {
            const gqlContext = GqlExecutionContext.create(context);
            const { operation, parentType } = gqlContext.getInfo<GraphQLResolveInfo>();

            if (parentType.name === "Mutation") {
                const skipBuild =
                    this.reflector.get<string[]>(SKIP_BUILD_METADATA_KEY, context.getHandler()) ||
                    this.reflector.get<string[]>(SKIP_BUILD_METADATA_KEY, context.getClass());

                if (!skipBuild) {
                    const scope = await this.contentScopeService.inferScopeFromExecutionContext(context);

                    if (process.env.NODE_ENV === "development" && this.changeAffectsAllScopes(scope)) {
                        if (operation.name) {
                            console.warn(`Mutation "${operation.name.value}" affects all scopes. Are you sure this is correct?`);
                        } else {
                            console.warn(`Unknown mutation affects all scopes. Are you sure this is correct?`);
                        }
                    }

                    await this.buildsService.setChangesSinceLastBuild(scope);
                }
            }
        }

        return next.handle();
    }

    private changeAffectsAllScopes(scope: ContentScope | undefined): boolean {
        return !scope || Object.keys(scope).length === 0; // Caused by features with optional scoping, e.g. redirects
    }
}
