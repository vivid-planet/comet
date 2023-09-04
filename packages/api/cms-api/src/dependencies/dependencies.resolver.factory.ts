import { AnyEntity } from "@mikro-orm/core";
import { Type } from "@nestjs/common";
import { Args, Parent, ResolveField, Resolver } from "@nestjs/graphql";

import { DependenciesService } from "./dependencies.service";
import { Dependency } from "./dependency";
import { DependenciesFilter } from "./dto/dependencies.filter";

export class DependenciesResolverFactory {
    static create<T extends Type<AnyEntity<{ id: string }>>>(classRef: T) {
        @Resolver(() => classRef)
        class DependenciesResolver {
            constructor(readonly dependenciesService: DependenciesService) {}

            @ResolveField(() => [Dependency])
            async dependencies(
                @Parent() node: AnyEntity<{ id: string }>,
                @Args("filter", { type: () => DependenciesFilter, nullable: true }) filter?: DependenciesFilter,
            ): Promise<Dependency[]> {
                return this.dependenciesService.getDependencies(node, filter);
            }
        }

        return DependenciesResolver;
    }
}
