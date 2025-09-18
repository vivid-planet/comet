import { AnyEntity } from "@mikro-orm/postgresql";
import { Type } from "@nestjs/common";
import { Args, Parent, ResolveField, Resolver } from "@nestjs/graphql";

import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator.js";
import { DependenciesService } from "./dependencies.service.js";
import { DependenciesArgs } from "./dto/dependencies.args.js";
import { PaginatedDependencies } from "./dto/paginated-dependencies.js";

export class DependenciesResolverFactory {
    static create<T extends Type<AnyEntity<{ id: string }>>>(classRef: T) {
        @Resolver(() => classRef)
        @RequiredPermission("dependencies")
        class DependenciesResolver {
            constructor(readonly dependenciesService: DependenciesService) {}

            @ResolveField(() => PaginatedDependencies)
            async dependencies(
                @Parent() node: AnyEntity<{ id: string }>,
                @Args() { filter, offset, limit, forceRefresh }: DependenciesArgs,
            ): Promise<PaginatedDependencies> {
                return this.dependenciesService.getDependencies(node, filter, { offset, limit }, { forceRefresh });
            }
        }

        return DependenciesResolver;
    }
}
