import { PublicApi, validateNotModified } from "@comet/cms-api";
import { FilterQuery, FindOptions } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { NewsInput } from "@src/news/dto/news.input";

import { NewsListArgs } from "./dto/news-list.args";
import { PaginatedNews } from "./dto/paginated-news";
import { News, NewsContentScope } from "./entities/news.entity";

@Resolver(() => News)
export class NewsResolver {
    constructor(@InjectRepository(News) private readonly newsRepository: EntityRepository<News>) {}

    @Query(() => News, { nullable: true })
    async news(@Args("id", { type: () => ID }) id: string): Promise<News | null> {
        const news = await this.newsRepository.findOne(id);

        return news ?? null;
    }

    @Query(() => News, { nullable: true })
    async newsBySlug(@Args("slug") slug: string): Promise<News | null> {
        const news = await this.newsRepository.findOne({ slug });

        return news ?? null;
    }

    @Query(() => PaginatedNews)
    @PublicApi()
    async newsList(@Args() { scope, query, category, offset, limit, sort, ...args }: NewsListArgs): Promise<PaginatedNews> {
        const where: FilterQuery<News> = { scope };
        if (query) where.title = { $ilike: `%${query}%` };
        const options: FindOptions<News> = { offset, limit };
        if (sort) {
            options.orderBy = sort.map((sortItem) => {
                return Object.entries(sortItem).reduce((acc, [field, direction]) => {
                    return { ...acc, [field]: direction };
                }, {});
            });
        }

        if (category) where.category = category;

        const [pages, totalCount] = await this.newsRepository.findAndCount(where, options);

        return new PaginatedNews(pages, totalCount, args);
    }

    @Mutation(() => News)
    async createNews(
        @Args("scope", { type: () => NewsContentScope }) scope: NewsContentScope,
        @Args("input", { type: () => NewsInput }) input: NewsInput,
    ): Promise<News> {
        const news = this.newsRepository.create({
            ...input,
            visible: false,
            scope: scope,
            image: input.image.transformToBlockData(),
            content: input.content.transformToBlockData(),
        });

        await this.newsRepository.persistAndFlush(news);
        return news;
    }

    @Mutation(() => News)
    async updateNews(
        @Args("id", { type: () => ID }) id: string,
        @Args("input", { type: () => NewsInput }) input: NewsInput,
        @Args("lastUpdatedAt", { type: () => Date, nullable: true }) lastUpdatedAt?: Date,
    ): Promise<News> {
        const news = await this.newsRepository.findOneOrFail(id);

        if (news != null && lastUpdatedAt) {
            validateNotModified(news, lastUpdatedAt);
        }
        news.assign({
            ...input,
            image: input.image.transformToBlockData(),
            content: input.content.transformToBlockData(),
        });

        await this.newsRepository.flush();

        return news;
    }

    @Mutation(() => News)
    async updateNewsVisibility(
        @Args("id", { type: () => ID }) id: string,
        @Args("visible", { type: () => Boolean }) visible: boolean,
    ): Promise<News> {
        const news = await this.newsRepository.findOneOrFail(id);

        news.assign({
            visible,
        });
        await this.newsRepository.flush();

        return news;
    }

    @Mutation(() => Boolean)
    async deleteNews(@Args("id", { type: () => ID }) id: string): Promise<boolean> {
        await this.newsRepository.removeAndFlush({ id });

        return true;
    }
}
