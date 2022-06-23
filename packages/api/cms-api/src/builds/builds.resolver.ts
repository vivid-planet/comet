import { Inject } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { BuildsService } from "./builds.service";
import { AutoBuildStatus } from "./dto/auto-build-status.object";
import { BuildObject } from "./dto/build.object";
import { SkipBuild } from "./skip-build.decorator";

@Resolver(() => BuildObject)
export class BuildsResolver {
    @Inject()
    private readonly buildsService: BuildsService;

    @Mutation(() => Boolean)
    @SkipBuild()
    async createBuild(): Promise<boolean> {
        return this.buildsService.createBuild();
    }

    @Query(() => [BuildObject])
    async builds(@Args("limit", { nullable: true }) limit?: number): Promise<BuildObject[]> {
        return this.buildsService.getBuilds({ limit: limit });
    }

    @Query(() => AutoBuildStatus)
    async autoBuildStatus(): Promise<AutoBuildStatus> {
        return this.buildsService.getAutoBuildStatus();
    }
}
