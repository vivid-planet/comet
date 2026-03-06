import { EntityManager, FindOptions } from "@mikro-orm/postgresql";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { NewsCommentInput, NewsCommentUpdateInput } from "./dto/news-comment.input";
import { PaginatedNewsComments } from "./dto/paginated-news-comments";
import { NewsCommentsArgs } from "./dto/news-comments.args";
import {
    AffectedEntity,
    RequiredPermission,
    gqlArgsToMikroOrmQuery,
    gqlSortToMikroOrmOrderBy,
} from "@comet/cms-api";
import { News } from "../entities/news.entity";
import { NewsComment } from "../entities/news-comment.entity";
@Resolver(() => NewsComment)
@RequiredPermission(["news-comments"])
export class NewsCommentResolver {
    constructor(protected readonly entityManager: EntityManager) {}
    @Query(() => NewsComment)
    @AffectedEntity(NewsComment)
    async newsComment(
        @Args("id", { type: () => ID })
        id: string,
    ): Promise<NewsComment> {
        const newsComment = await this.entityManager.findOneOrFail(NewsComment, id);
        return newsComment;
    }
    @Query(() => PaginatedNewsComments)
    @AffectedEntity(News, { idArg: "newsId" })
    async newsComments(
        @Args("newsId", { type: () => ID })
        newsId: string,
        @Args()
        { search, filter, sort, offset, limit }: NewsCommentsArgs,
    ): Promise<PaginatedNewsComments> {
        const where = gqlArgsToMikroOrmQuery({ search, filter }, this.entityManager.getMetadata(NewsComment));
        where.news = newsId;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options: FindOptions<NewsComment, any> = { offset, limit, populate: [] };
        if (sort) {
            options.orderBy = gqlSortToMikroOrmOrderBy(sort);
        }
        const [entities, totalCount] = await this.entityManager.findAndCount(NewsComment, where, options);
        return new PaginatedNewsComments(entities, totalCount);
    }
    @Mutation(() => NewsComment)
    @AffectedEntity(News, { idArg: "newsId" })
    async createNewsComment(
        @Args("newsId", { type: () => ID })
        newsId: string,
        @Args("input", { type: () => NewsCommentInput })
        input: NewsCommentInput,
    ): Promise<NewsComment> {
        const news = await this.entityManager.findOneOrFail(News, newsId);
        const { ...assignInput } = input;
        const newsComment = this.entityManager.create(NewsComment, {
            ...assignInput,
            news,
        });
        await this.entityManager.flush();
        return newsComment;
    }
    @Mutation(() => NewsComment)
    @AffectedEntity(NewsComment)
    async updateNewsComment(
        @Args("id", { type: () => ID })
        id: string,
        @Args("input", { type: () => NewsCommentUpdateInput })
        input: NewsCommentUpdateInput,
    ): Promise<NewsComment> {
        const newsComment = await this.entityManager.findOneOrFail(NewsComment, id);
        const { ...assignInput } = input;
        newsComment.assign({
            ...assignInput,
        });
        await this.entityManager.flush();
        return newsComment;
    }
    @Mutation(() => Boolean)
    @AffectedEntity(NewsComment)
    async deleteNewsComment(
        @Args("id", { type: () => ID })
        id: string,
    ): Promise<boolean> {
        const newsComment = await this.entityManager.findOneOrFail(NewsComment, id);
        this.entityManager.remove(newsComment);
        await this.entityManager.flush();
        return true;
    }
}
