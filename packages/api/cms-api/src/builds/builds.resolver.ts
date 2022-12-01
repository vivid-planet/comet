import { V1CronJob } from "@kubernetes/client-node";
import { Inject } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { CurrentUserInterface } from "../auth/current-user/current-user";
import { GetCurrentUser } from "../auth/decorators/get-current-user.decorator";
import { ContentScopeService } from "../content-scope/content-scope.service";
import { BUILDS_CONFIG, INSTANCE_LABEL } from "./builds.constants";
import { BuildsConfig } from "./builds.module";
import { BuildsService } from "./builds.service";
import { AutoBuildStatus } from "./dto/auto-build-status.object";
import { BuildObject } from "./dto/build.object";
import { CreateBuildsInput } from "./dto/create-builds.input";
import { KubernetesService } from "./kubernetes.service";
import { SkipBuild } from "./skip-build.decorator";

@Resolver(() => BuildObject)
export class BuildsResolver {
    helmRelease: string;

    constructor(
        @Inject(BUILDS_CONFIG) readonly config: BuildsConfig,
        private readonly kubernetesService: KubernetesService,
        private readonly buildsService: BuildsService,
        private readonly contentScopeService: ContentScopeService,
    ) {
        this.helmRelease = config.helmRelease;
    }

    @Mutation(() => Boolean)
    @SkipBuild()
    async createBuilds(
        @GetCurrentUser() user: CurrentUserInterface,
        @Args("input", { type: () => CreateBuildsInput }) { names }: CreateBuildsInput,
    ): Promise<boolean> {
        const cronJobs: V1CronJob[] = [];
        for (const name of names) {
            const cronJob = await this.kubernetesService.getCronJob(name);

            if (this.helmRelease !== cronJob.metadata?.labels?.[INSTANCE_LABEL]) {
                throw new Error("Triggering build from different instance is not allowed");
            }

            if (!this.contentScopeService.canAccessScope(this.kubernetesService.getContentScope(cronJob), user)) {
                throw new Error("Triggering build not allowed");
            }

            cronJobs.push(cronJob);
        }
        return this.buildsService.createBuilds("manual", cronJobs);
    }

    @Query(() => [BuildObject])
    async builds(@GetCurrentUser() user: CurrentUserInterface, @Args("limit", { nullable: true }) limit?: number): Promise<BuildObject[]> {
        return this.buildsService.getBuilds(user, { limit: limit });
    }

    @Query(() => AutoBuildStatus)
    async autoBuildStatus(@GetCurrentUser() user: CurrentUserInterface): Promise<AutoBuildStatus> {
        return this.buildsService.getAutoBuildStatus(user);
    }
}
