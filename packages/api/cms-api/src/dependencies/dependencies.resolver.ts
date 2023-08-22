import { AnyEntity } from "@mikro-orm/core";
import { Type } from "@nestjs/common";
import { Parent, ResolveField, Resolver } from "@nestjs/graphql";

import { DependenciesService } from "./dependencies.service";
import { Dependency } from "./dependency";

interface DependenciesResolverInterface {
    dependencies: (entity: AnyEntity<{ id: string }>) => Promise<Dependency[]>;
}
interface DependentsResolverInterface {
    dependents: (entity: AnyEntity<{ id: string }>) => Promise<Dependency[]>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DependenciesResolver<T extends Type<unknown>>(classRef: T): any {
    @Resolver(() => classRef, { isAbstract: true })
    abstract class DependenciesResolverHost implements DependenciesResolverInterface {
        protected constructor(private readonly dependenciesService: DependenciesService) {}

        @ResolveField(() => [Dependency])
        async dependencies(@Parent() node: AnyEntity<{ id: string }>): Promise<Dependency[]> {
            return this.dependenciesService.getDependencies(node);
        }
    }

    return DependenciesResolverHost;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DependentsResolver<T extends Type<unknown>>(classRef: T): any {
    @Resolver(() => classRef, { isAbstract: true })
    abstract class DependentsResolverHost implements DependentsResolverInterface {
        protected constructor(private readonly dependenciesService: DependenciesService) {}

        @ResolveField(() => [Dependency])
        async dependents(@Parent() node: AnyEntity<{ id: string }>): Promise<Dependency[]> {
            return this.dependenciesService.getDependents(node);
        }
    }

    return DependentsResolverHost;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DependenciesAndDependentsResolver<T extends Type<unknown>>(classRef: T): any {
    @Resolver(() => classRef, { isAbstract: true })
    abstract class DependenciesAndDependentsResolverHost {
        protected constructor(private readonly dependenciesService: DependenciesService) {}

        @ResolveField(() => [Dependency])
        async dependencies(@Parent() node: AnyEntity<{ id: string }>): Promise<Dependency[]> {
            return this.dependenciesService.getDependencies(node);
        }

        @ResolveField(() => [Dependency])
        async dependents(@Parent() node: AnyEntity<{ id: string }>): Promise<Dependency[]> {
            return this.dependenciesService.getDependents(node);
        }
    }

    return DependenciesAndDependentsResolverHost;
}
