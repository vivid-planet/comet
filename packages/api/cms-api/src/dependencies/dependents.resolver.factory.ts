import { AnyEntity } from "@mikro-orm/core";
import { Type } from "@nestjs/common";
import { Args, Parent, ResolveField, Resolver } from "@nestjs/graphql";

import { DependenciesService } from "./dependencies.service";
import { Dependency } from "./dependency";
import { DependentsFilter } from "./dto/dependencies.args";

export class DependentsResolverFactory {
    static create<T extends Type<AnyEntity<{ id: string }>>>(classRef: T) {
        @Resolver(() => classRef)
        class DependentsResolver {
            constructor(readonly dependenciesService: DependenciesService) {}

            @ResolveField(() => [Dependency])
            async dependents(
                @Parent() node: AnyEntity<{ id: string }>,
                @Args("filter", { type: () => DependentsFilter, nullable: true }) filter?: DependentsFilter,
            ): Promise<Dependency[]> {
                return this.dependenciesService.getDependents(node, filter);
            }
        }

        return DependentsResolver;
    }
}
