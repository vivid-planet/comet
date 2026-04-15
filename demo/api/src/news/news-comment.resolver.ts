import { AffectedEntity } from "@comet/cms-api";
import { EntityManager } from "@mikro-orm/postgresql";
import { Args, ID, Mutation, Resolver } from "@nestjs/graphql";
import { McpTool } from "@src/mcp/mcp-tool.decorator";

import { NewsCommentInput } from "./dto/news-comment.input";
import { News } from "./entities/news.entity";
import { NewsComment } from "./entities/news-comment.entity";

@Resolver(() => NewsComment)
export class NewsCommentResolver {
    constructor(private readonly entityManager: EntityManager) {}

    @Mutation(() => NewsComment)
    @AffectedEntity(News, { idArg: "newsId" })
    @McpTool({ description: "Create a new comment on a news article" })
    async createNewsComment(
        @Args("newsId", { type: () => ID }) newsId: string,
        @Args("input", { type: () => NewsCommentInput }) input: NewsCommentInput,
    ): Promise<NewsComment> {
        const news = await this.entityManager.findOneOrFail(News, newsId);

        const newsComment = this.entityManager.create(NewsComment, {
            ...input,
            news,
        });

        await this.entityManager.persistAndFlush(newsComment);
        return newsComment;
    }

    @Mutation(() => NewsComment)
    @AffectedEntity(NewsComment)
    @McpTool({ description: "Update an existing news comment" })
    async updateNewsComment(
        @Args("id", { type: () => ID }) id: string,
        @Args("input", { type: () => NewsCommentInput }) input: NewsCommentInput,
    ): Promise<NewsComment> {
        const newsComment = await this.entityManager.findOneOrFail(NewsComment, id);
        newsComment.assign({
            ...input,
        });

        await this.entityManager.flush();

        return newsComment;
    }

    @Mutation(() => Boolean)
    @AffectedEntity(NewsComment)
    @McpTool({ description: "Delete a news comment by ID" })
    async deleteNewsComment(@Args("id", { type: () => ID }) id: string): Promise<boolean> {
        await this.entityManager.removeAndFlush({ id });

        return true;
    }
}
