import { DependenciesResolver, DependenciesService } from "@comet/cms-api";
import { Resolver } from "@nestjs/graphql";
import { Footer } from "@src/footer/entities/footer.entity";

@Resolver(() => Footer)
export class FooterFieldResolver extends DependenciesResolver(Footer) {
    constructor(private readonly dependenciesService: DependenciesService) {
        super(dependenciesService);
    }
}
