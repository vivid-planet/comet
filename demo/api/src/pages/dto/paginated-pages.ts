import { PaginatedResponseFactory } from "@comet/cms-api";
import { ObjectType } from "@nestjs/graphql";

import { Page } from "../entities/page.entity";

@ObjectType()
export class PaginatedPages extends PaginatedResponseFactory.create(Page) {}
