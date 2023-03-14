import { DependenciesService, Dependency } from "@comet/cms-api";
import { Parent, ResolveField, Resolver } from "@nestjs/graphql";

import { News } from "./entities/news.entity";
import { NewsComment } from "./entities/news-comment.entity";

@Resolver(() => News)
export class NewsFieldResolver {
    constructor(private readonly dependenciesService: DependenciesService) {}

    @ResolveField(() => [NewsComment])
    async comments(@Parent() news: News): Promise<NewsComment[]> {
        return news.comments.loadItems();
    }

    @ResolveField(() => [Dependency])
    async dependents(@Parent() news: News): Promise<Dependency[]> {
        return this.dependenciesService.getDependents(news);
    }

    @ResolveField(() => [Dependency])
    async dependencies(@Parent() news: News): Promise<Dependency[]> {
        return this.dependenciesService.getDependencies(news);
    }
}
