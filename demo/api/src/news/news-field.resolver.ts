import { BlockIndexDependency, BlockIndexService } from "@comet/cms-api";
import { Parent, ResolveField, Resolver } from "@nestjs/graphql";

import { News, NEWS_BLOCK_INDEX_IDENTIFIER } from "./entities/news.entity";
import { NewsComment } from "./entities/news-comment.entity";

@Resolver(() => News)
export class NewsFieldResolver {
    constructor(private readonly blockIndexService: BlockIndexService) {}

    @ResolveField(() => [NewsComment])
    async comments(@Parent() news: News): Promise<NewsComment[]> {
        return news.comments.loadItems();
    }

    @ResolveField(() => [BlockIndexDependency])
    async dependents(@Parent() news: News): Promise<BlockIndexDependency[]> {
        return this.blockIndexService.getDependentsByTargetIdentifierAndTargetId(NEWS_BLOCK_INDEX_IDENTIFIER, news.id);
    }

    @ResolveField(() => [BlockIndexDependency])
    async dependencies(@Parent() news: News): Promise<BlockIndexDependency[]> {
        return this.blockIndexService.getDependenciesByRootIdentifierAndRootId(NEWS_BLOCK_INDEX_IDENTIFIER, news.id);
    }
}
