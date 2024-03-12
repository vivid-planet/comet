import { AnyEntity } from "@mikro-orm/core";
import { Type } from "@nestjs/common";
import { Args, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { camelCase } from "change-case";

import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
import { DependenciesService } from "./dependencies.service";
import { DependenciesArgs } from "./dto/dependencies.args";
import { PaginatedDependencies } from "./dto/paginated-dependencies";

export class DependenciesResolverFactory {
    static create<T extends Type<AnyEntity<{ id: string }>>>(options: T | { entity: T; requiredPermission: string[] | string }) {
        let entity: T;
        let requiredPermission: string[] | string;

        if (typeof options === "object") {
            entity = options.entity;
            requiredPermission = options.requiredPermission;
        } else {
            entity = options;
            requiredPermission = camelCase(entity.name);
        }

        @Resolver(() => entity)
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
