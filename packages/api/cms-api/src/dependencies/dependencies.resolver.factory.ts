import { AnyEntity } from "@mikro-orm/core";
import { Type } from "@nestjs/common";
import { Args, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { camelCase } from "change-case";

import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
import { DependenciesService } from "./dependencies.service";
import { DependenciesArgs } from "./dto/dependencies.args";
import { PaginatedDependencies } from "./dto/paginated-dependencies";

export class DependenciesResolverFactory {
    static create<T extends Type<AnyEntity<{ id: string }>>>(options: T | { classRef: T; requiredPermission: string[] | string }) {
        let classRef: T;
        let requiredPermission: string[] | string;

        if (typeof options === "object") {
            classRef = options.classRef;
            requiredPermission = options.requiredPermission;
        } else {
            classRef = options;
            requiredPermission = camelCase(classRef.name);
        }

        @Resolver(() => classRef)
        @RequiredPermission(requiredPermission)
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
