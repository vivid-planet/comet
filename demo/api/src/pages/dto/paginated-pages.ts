import { PaginatedResponseFactory } from "@comet/api-cms";
import { ObjectType } from "@nestjs/graphql";

import { Page } from "../entities/page.entity";

@ObjectType()
export class PaginatedPages extends PaginatedResponseFactory.create(Page) {}
