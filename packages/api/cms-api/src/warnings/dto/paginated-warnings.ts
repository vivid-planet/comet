import { ObjectType } from "@nestjs/graphql";

import { PaginatedResponseFactory } from "../../common/pagination/paginated-response.factory";
import { Warning } from "../entities/warning.entity";

@ObjectType()
export class PaginatedWarnings extends PaginatedResponseFactory.create(Warning) {}
