import { AffectedEntity, RequiredPermission } from "@comet/cms-api";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Args, ID, Query, Resolver } from "@nestjs/graphql";
import { ProjectPermission } from "@src/common/enum/project-permission.enum";

import { News } from "./entities/news.entity";

@Resolver(() => News)
@RequiredPermission(ProjectPermission.news)
export class ExtendedNewsResolver {
    constructor(@InjectRepository(News) private readonly repository: EntityRepository<News>) {}

    @Query(() => [News])
    @AffectedEntity(News, { idArg: "ids" })
    async newsListByIds(@Args("ids", { type: () => [ID] }) ids: string[]): Promise<News[]> {
        const newsList = await this.repository.find({ id: { $in: ids } });

        if (newsList.length !== ids.length) {
            throw new Error("Failed to load all requested news");
        }

        return newsList.sort((newsA, newsB) => ids.indexOf(newsA.id) - ids.indexOf(newsB.id));
    }
}
