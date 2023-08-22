import { DependenciesResolver } from "@comet/cms-api";
import { Resolver } from "@nestjs/graphql";
import { Footer } from "@src/footer/entities/footer.entity";

@Resolver(() => Footer)
export class FooterFieldResolver extends DependenciesResolver(Footer) {
    constructor() {
        super();
    }
}
