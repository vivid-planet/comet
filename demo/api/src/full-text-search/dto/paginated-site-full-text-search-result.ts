import { PaginatedResponseFactory } from "@comet/cms-api";
import { ObjectType } from "@nestjs/graphql";

import { SiteFullTextSearchResult } from "../entities/site-full-text-search-result.entity";

@ObjectType()
export class PaginatedSiteFullTextSearchResult extends PaginatedResponseFactory.create(SiteFullTextSearchResult) {}
