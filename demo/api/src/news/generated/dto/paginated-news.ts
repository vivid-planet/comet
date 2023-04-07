import { PaginatedResponseFactory } from "@comet/cms-api";
import { ObjectType } from "@nestjs/graphql";

import { News } from "../../entities/news.entity";

@ObjectType()
export class PaginatedNews extends PaginatedResponseFactory.create(News) {}
