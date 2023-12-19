import { AffectedEntity } from "@comet/cms-api";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Args, ID, Mutation, Resolver } from "@nestjs/graphql";

import { NewsCommentInput } from "./dto/news-comment.input";
import { News } from "./entities/news.entity";
import { NewsComment } from "./entities/news-comment.entity";

@Resolver(() => NewsComment)
export class NewsCommentResolver {
    constructor(
        @InjectRepository(NewsComment) private readonly newsCommentRepository: EntityRepository<NewsComment>,
        @InjectRepository(News) private readonly newsRepository: EntityRepository<News>,
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

        await this.newsCommentRepository.persistAndFlush(newsComment);
        return newsComment;
    }

    @Mutation(() => NewsComment)
    @AffectedEntity(NewsComment)
    async updateNewsComment(
        @Args("id", { type: () => ID }) id: string,
        @Args("input", { type: () => NewsCommentInput }) input: NewsCommentInput,
        @Args("lastUpdatedAt", { type: () => Date, nullable: true }) lastUpdatedAt?: Date,
    ): Promise<NewsComment> {
        const newsComment = await this.newsCommentRepository.findOneOrFail(id);
        console.log(lastUpdatedAt);
        if (lastUpdatedAt) {
            //validateNotModified(newsComment, lastUpdatedAt);
        }
        newsComment.assign({
            ...input,
        });

        await this.newsCommentRepository.flush();

        return newsComment;
    }

    @Mutation(() => Boolean)
    @AffectedEntity(NewsComment)
    async deleteNewsComment(@Args("id", { type: () => ID }) id: string): Promise<boolean> {
        await this.newsCommentRepository.removeAndFlush({ id });

        return true;
    }
}
