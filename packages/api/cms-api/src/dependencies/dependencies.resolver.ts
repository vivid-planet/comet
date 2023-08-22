import { AnyEntity } from "@mikro-orm/core";
import { Type } from "@nestjs/common";
import { Args, Parent, ResolveField, Resolver } from "@nestjs/graphql";

import { DependenciesService } from "./dependencies.service";
import { Dependency } from "./dependency";
import { DependenciesFilterInput, DependentsFilterInput } from "./dto/dependencies.args";

type AbstractConstructor<T> = abstract new (...args: [DependenciesService]) => T;

interface DependenciesResolverInterface {
    dependencies: (entity: AnyEntity<{ id: string }>, filter: DependenciesFilterInput) => Promise<Dependency[]>;
}
interface DependentsResolverInterface {
    dependents: (entity: AnyEntity<{ id: string }>, filter: DependentsFilterInput) => Promise<Dependency[]>;
}

export function DependenciesResolver<T extends Type<unknown>>(classRef: T): AbstractConstructor<DependenciesResolverInterface> {
    @Resolver(() => classRef, { isAbstract: true })
    abstract class DependenciesResolverHost implements DependenciesResolverInterface {
        constructor(readonly dependenciesService: DependenciesService) {}

        @ResolveField(() => [Dependency])
        async dependencies(
            @Parent() node: AnyEntity<{ id: string }>,
            @Args("filter", { type: () => DependenciesFilterInput, nullable: true }) filter?: DependenciesFilterInput,
        ): Promise<Dependency[]> {
            return this.dependenciesService.getDependencies(node, filter);
        }
    }

    return DependenciesResolverHost;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DependentsResolver<T extends Type<unknown>>(classRef: T): AbstractConstructor<DependentsResolverInterface> {
    @Resolver(() => classRef, { isAbstract: true })
    abstract class DependentsResolverHost implements DependentsResolverInterface {
        constructor(readonly dependenciesService: DependenciesService) {}

        @ResolveField(() => [Dependency])
        async dependents(
            @Parent() node: AnyEntity<{ id: string }>,
            @Args("filter", { type: () => DependentsFilterInput, nullable: true }) filter?: DependentsFilterInput,
        ): Promise<Dependency[]> {
            return this.dependenciesService.getDependents(node, filter);
        }
    }

    return DependentsResolverHost;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DependenciesAndDependentsResolver<T extends Type<unknown>>(
    classRef: T,
): AbstractConstructor<DependenciesResolverInterface & DependentsResolverInterface> {
    @Resolver(() => classRef, { isAbstract: true })
    abstract class DependenciesAndDependentsResolverHost implements DependenciesResolverInterface, DependentsResolverInterface {
        constructor(readonly dependenciesService: DependenciesService) {}

        @ResolveField(() => [Dependency])
        async dependencies(
            @Parent() node: AnyEntity<{ id: string }>,
            @Args("filter", { type: () => DependenciesFilterInput, nullable: true }) filter?: DependenciesFilterInput,
        ): Promise<Dependency[]> {
            return this.dependenciesService.getDependencies(node, filter);
        }

        @ResolveField(() => [Dependency])
        async dependents(
            @Parent() node: AnyEntity<{ id: string }>,
            @Args("filter", { type: () => DependentsFilterInput, nullable: true }) filter?: DependentsFilterInput,
        ): Promise<Dependency[]> {
            return this.dependenciesService.getDependents(node, filter);
        }
    }

    return DependenciesAndDependentsResolverHost;
}
