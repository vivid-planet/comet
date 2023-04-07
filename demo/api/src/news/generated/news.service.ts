import { filtersToMikroOrmQuery, searchToMikroOrmQuery } from "@comet/cms-api";
import { ObjectQuery } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";

import { News } from "../entities/news.entity";
import { NewsFilter } from "./dto/news.filter";

@Injectable()
export class NewsService {
    getFindCondition(options: { search?: string; filter?: NewsFilter }): ObjectQuery<News> {
        const andFilters = [];

        if (options.search) {
            andFilters.push(searchToMikroOrmQuery(options.search, ["slug", "title", "category"]));
        }

        if (options.filter) {
            andFilters.push(filtersToMikroOrmQuery(options.filter));
        }

        return andFilters.length > 0 ? { $and: andFilters } : {};
    }
}
