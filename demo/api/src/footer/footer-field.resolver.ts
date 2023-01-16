import { BlockIndexDependency, BlockIndexService } from "@comet/cms-api";
import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { Footer, FOOTER_BLOCK_INDEX_IDENTIFIER } from "@src/footer/entities/footer.entity";

@Resolver(() => Footer)
export class FooterFieldResolver {
    constructor(private readonly blockIndexService: BlockIndexService) {}

    @ResolveField(() => [BlockIndexDependency])
    async dependencies(@Parent() footer: Footer): Promise<BlockIndexDependency[]> {
        return this.blockIndexService.getDependenciesByRootIdentifierAndRootId(FOOTER_BLOCK_INDEX_IDENTIFIER, footer.id);
    }
}
