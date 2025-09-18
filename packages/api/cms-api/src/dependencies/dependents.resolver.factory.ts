import { AnyEntity } from "@mikro-orm/postgresql";
import { Type } from "@nestjs/common";
import { Args, Parent, ResolveField, Resolver } from "@nestjs/graphql";

import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator.js";
import { DependenciesService } from "./dependencies.service.js";
import { DependentsArgs } from "./dto/dependencies.args.js";
import { PaginatedDependencies } from "./dto/paginated-dependencies.js";

export class DependentsResolverFactory {
    static create<T extends Type<AnyEntity<{ id: string }>>>(classRef: T) {
        @Resolver(() => classRef)
        @RequiredPermission("dependencies")
        class DependentsResolver {
            constructor(readonly dependenciesService: DependenciesService) {}

            @ResolveField(() => PaginatedDependencies)
            async dependents(
                @Parent() node: AnyEntity<{ id: string }>,
                @Args() { filter, offset, limit, forceRefresh }: DependentsArgs,
            ): Promise<PaginatedDependencies> {
                return this.dependenciesService.getDependents(node, filter, { offset, limit }, { forceRefresh });
            }
        }

        return DependentsResolver;
    }
}
