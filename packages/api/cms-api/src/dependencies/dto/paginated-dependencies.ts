import { ObjectType } from "@nestjs/graphql";

import { PaginatedResponseFactory } from "../../common/pagination/paginated-response.factory";
import { Dependency } from "../dependency";

@ObjectType()
export class PaginatedDependencies extends PaginatedResponseFactory.create(Dependency) {}
