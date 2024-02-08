import { V1CronJob } from "@kubernetes/client-node";
import { Inject } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { CurrentUserInterface } from "../auth/current-user/current-user";
import { GetCurrentUser } from "../auth/decorators/get-current-user.decorator";
import { INSTANCE_LABEL } from "../kubernetes/kubernetes.constants";
import { KubernetesService } from "../kubernetes/kubernetes.service";
import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
import { ACCESS_CONTROL_SERVICE } from "../user-permissions/user-permissions.constants";
import { AccessControlServiceInterface } from "../user-permissions/user-permissions.types";
import { BuildsService } from "./builds.service";
import { AutoBuildStatus } from "./dto/auto-build-status.object";
import { Build } from "./dto/build.object";
import { CreateBuildsInput } from "./dto/create-builds.input";
import { SkipBuild } from "./skip-build.decorator";

@Resolver(() => Build)
@RequiredPermission(["builds"], { skipScopeCheck: true }) // Scopes are checked in code
export class BuildsResolver {
    constructor(
        private readonly kubernetesService: KubernetesService,
        private readonly buildsService: BuildsService,
        @Inject(ACCESS_CONTROL_SERVICE) private accessControlService: AccessControlServiceInterface,
    ) {}

    @Mutation(() => Boolean)
    @SkipBuild()
    async createBuilds(
        @GetCurrentUser() user: CurrentUserInterface,
        @Args("input", { type: () => CreateBuildsInput }) { names }: CreateBuildsInput,
    ): Promise<boolean> {
        const cronJobs: V1CronJob[] = [];
        for (const name of names) {
            const cronJob = await this.kubernetesService.getCronJob(name);
            if (this.kubernetesService.helmRelease !== cronJob.metadata?.labels?.[INSTANCE_LABEL]) {
                throw new Error("Triggering build from different instance is not allowed");
            }

            if (!this.accessControlService.isAllowed(user, "builds", this.kubernetesService.getContentScope(cronJob) ?? {})) {
                throw new Error("Triggering build not allowed");
            }

            cronJobs.push(cronJob);
        }
        return this.buildsService.createBuilds("manual", cronJobs);
    }

    @Query(() => [Build])
    async builds(@GetCurrentUser() user: CurrentUserInterface, @Args("limit", { nullable: true }) limit?: number): Promise<Build[]> {
        return this.buildsService.getBuilds(user, { limit: limit });
    }

    @Query(() => AutoBuildStatus)
    async autoBuildStatus(@GetCurrentUser() user: CurrentUserInterface): Promise<AutoBuildStatus> {
        return this.buildsService.getAutoBuildStatus(user);
    }
}
