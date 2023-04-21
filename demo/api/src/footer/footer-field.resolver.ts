import { DependenciesService, Dependency } from "@comet/cms-api";
import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { Footer } from "@src/footer/entities/footer.entity";

@Resolver(() => Footer)
export class FooterFieldResolver {
    constructor(private readonly dependenciesService: DependenciesService) {}

    @ResolveField(() => [Dependency])
    async dependencies(@Parent() footer: Footer): Promise<Dependency[]> {
        return this.dependenciesService.getDependencies(footer);
    }
}
