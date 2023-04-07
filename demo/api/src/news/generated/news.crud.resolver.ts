import { SubjectEntity, validateNotModified } from "@comet/cms-api";
import { FindOptions } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";

import { News, NewsContentScope } from "../entities/news.entity";
import { NewsInput } from "./dto/news.input";
import { NewsListArgs } from "./dto/news-list.args";
import { PaginatedNews } from "./dto/paginated-news";
import { NewsService } from "./news.service";

@Resolver(() => News)
export class NewsCrudResolver {
    constructor(private readonly newsService: NewsService, @InjectRepository(News) private readonly repository: EntityRepository<News>) {}

    @Query(() => News)
    @SubjectEntity(News)
    async news(@Args("id", { type: () => ID }) id: string): Promise<News> {
        const news = await this.repository.findOneOrFail(id);
        return news;
    }

    @Query(() => News, { nullable: true })
    async newsBySlug(@Args("slug") slug: string): Promise<News | null> {
        const news = await this.repository.findOne({ slug });

        return news ?? null;
    }

    @Query(() => PaginatedNews)
    async newsList(@Args() { scope, search, filter, sort, offset, limit }: NewsListArgs): Promise<PaginatedNews> {
        const where = this.newsService.getFindCondition({ search, filter });
        where.scope = scope;
        const options: FindOptions<News> = { offset, limit };

        if (sort) {
            options.orderBy = sort.map((sortItem) => {
                return {
                    [sortItem.field]: sortItem.direction,
                };
            });
        }

        const [entities, totalCount] = await this.repository.findAndCount(where, options);
        return new PaginatedNews(entities, totalCount);
    }

    @Mutation(() => News)
    async createNews(
        @Args("scope", { type: () => NewsContentScope }) scope: NewsContentScope,
        @Args("input", { type: () => NewsInput }) input: NewsInput,
    ): Promise<News> {
        const news = this.repository.create({
            ...input,
            image: input.image.transformToBlockData(),
            content: input.content.transformToBlockData(),
            visible: false,
            scope,
        });

        await this.repository.persistAndFlush(news);
        return news;
    }

    @Mutation(() => News)
    @SubjectEntity(News)
    async updateNews(
        @Args("id", { type: () => ID }) id: string,
        @Args("input", { type: () => NewsInput }) input: NewsInput,
        @Args("lastUpdatedAt", { type: () => Date, nullable: true }) lastUpdatedAt?: Date,
    ): Promise<News> {
        const news = await this.repository.findOneOrFail(id);
        if (lastUpdatedAt) {
            validateNotModified(news, lastUpdatedAt);
        }
        news.assign({
            ...input,
            image: input.image.transformToBlockData(),
            content: input.content.transformToBlockData(),
        });

        await this.repository.persistAndFlush(news);

        return news;
    }

    @Mutation(() => Boolean)
    @SubjectEntity(News)
    async deleteNews(@Args("id", { type: () => ID }) id: string): Promise<boolean> {
        const news = await this.repository.findOneOrFail(id);
        await this.repository.removeAndFlush(news);

        return true;
    }

    @Mutation(() => News)
    @SubjectEntity(News)
    async updateNewsVisibility(
        @Args("id", { type: () => ID }) id: string,
        @Args("visible", { type: () => Boolean }) visible: boolean,
    ): Promise<News> {
        const news = await this.repository.findOneOrFail(id);

        news.assign({
            visible,
        });
        await this.repository.flush();

        return news;
    }
}
