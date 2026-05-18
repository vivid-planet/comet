import { ObjectType } from "@nestjs/graphql";

import { PaginatedResponseFactory } from "../../common/pagination/paginated-response.factory";
import { FullTextSearchResultObject } from "./full-text-search-result";

@ObjectType()
export class PaginatedFullTextSearch extends PaginatedResponseFactory.create(FullTextSearchResultObject) {}
