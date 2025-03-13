import { AffectedEntity } from "@comet/cms-api";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Args, ID, Mutation, Resolver } from "@nestjs/graphql";

import { NewsCommentInput } from "./dto/news-comment.input";
import { News } from "./entities/news.entity";
import { NewsComment } from "./entities/news-comment.entity";

@Resolver(() => NewsComment)
export class NewsCommentResolver {
    constructor(
        @InjectRepository(NewsComment) private readonly newsCommentRepository: EntityRepository<NewsComment>,
        @InjectRepository(News) private readonly newsRepository: EntityRepository<News>,
        private readonly entityManager: EntityManager,
    ) {}

    @Mutation(() => NewsComment)
    @AffectedEntity(News, { idArg: "newsId" })
    async createNewsComment(
        @Args("newsId", { type: () => ID }) newsId: string,
        @Args("input", { type: () => NewsCommentInput }) input: NewsCommentInput,
    ): Promise<NewsComment> {
        const news = await this.newsRepository.findOneOrFail(newsId);

        const newsComment = this.newsCommentRepository.create({
            ...input,
            news,
        });

        await this.entityManager.persistAndFlush(newsComment);
        return newsComment;
    }

    @Mutation(() => NewsComment)
    @AffectedEntity(NewsComment)
    async updateNewsComment(
        @Args("id", { type: () => ID }) id: string,
        @Args("input", { type: () => NewsCommentInput }) input: NewsCommentInput,
    ): Promise<NewsComment> {
        const newsComment = await this.newsCommentRepository.findOneOrFail(id);
        newsComment.assign({
            ...input,
        });

        await this.entityManager.flush();

        return newsComment;
    }

    @Mutation(() => Boolean)
    @AffectedEntity(NewsComment)
    async deleteNewsComment(@Args("id", { type: () => ID }) id: string): Promise<boolean> {
        await this.entityManager.removeAndFlush({ id });

        return true;
    }
}
