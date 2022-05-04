import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { NewsInput } from "@src/news/dto/news.input";

import { News } from "./entities/news.entity";

@Resolver(() => News)
export class NewsResolver {
    constructor(@InjectRepository(News) private readonly newsRepository: EntityRepository<News>) {}

    @Query(() => News, { nullable: true })
    async news(@Args("newsId", { type: () => ID }) newsId: string): Promise<News | null> {
        const news = await this.newsRepository.findOne(newsId);

        return news ?? null;
    }

    @Query(() => News, { nullable: true })
    async newsBySlug(@Args("slug") slug: string): Promise<News | null> {
        const news = await this.newsRepository.findOne({ slug });

        return news ?? null;
    }

    @Query(() => [News])
    async newsList(): Promise<News[]> {
        return this.newsRepository.findAll();
    }

    @Mutation(() => News)
    async createNews(@Args("input", { type: () => NewsInput }) input: NewsInput): Promise<News> {
        const news = new News();
        news.slug = input.slug;
        news.title = input.title;

        await this.newsRepository.persistAndFlush(news);
        return news;
    }

    @Mutation(() => News)
    async updateNews(@Args("newsId", { type: () => ID }) newsId: string, @Args("input", { type: () => NewsInput }) input: NewsInput): Promise<News> {
        const news = await this.newsRepository.findOneOrFail(newsId);
        news.slug = input.slug;
        news.title = input.title;

        await this.newsRepository.persistAndFlush(news);

        return news;
    }

    @Mutation(() => Boolean)
    async deleteNews(@Args("id", { type: () => ID }) id: string): Promise<boolean> {
        await this.newsRepository.removeAndFlush({ id });

        return true;
    }
}
