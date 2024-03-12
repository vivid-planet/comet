import { AnyEntity } from "@mikro-orm/core";
import { Type } from "@nestjs/common";
import { Args, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { camelCase } from "change-case";

import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
import { DependenciesService } from "./dependencies.service";
import { DependentsArgs } from "./dto/dependencies.args";
import { PaginatedDependencies } from "./dto/paginated-dependencies";

export class DependentsResolverFactory {
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
