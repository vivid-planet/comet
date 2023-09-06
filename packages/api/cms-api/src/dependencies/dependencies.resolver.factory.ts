import { AnyEntity } from "@mikro-orm/core";
import { Type } from "@nestjs/common";
import { Args, Parent, ResolveField, Resolver } from "@nestjs/graphql";

import { DependenciesService } from "./dependencies.service";
import { DependenciesArgs } from "./dto/dependencies.args";
import { PaginatedDependencies } from "./dto/paginated-dependencies";

export class DependenciesResolverFactory {
    static create<T extends Type<AnyEntity<{ id: string }>>>(classRef: T) {
        @Resolver(() => classRef)
        class DependenciesResolver {
            constructor(readonly dependenciesService: DependenciesService) {}

            @ResolveField(() => PaginatedDependencies)
            async dependencies(
                @Parent() node: AnyEntity<{ id: string }>,
                @Args() { filter, offset, limit }: DependenciesArgs,
            ): Promise<PaginatedDependencies> {
                return this.dependenciesService.getDependencies(node, filter, { offset, limit });
            }
        }

        return DependenciesResolver;
    }
}
