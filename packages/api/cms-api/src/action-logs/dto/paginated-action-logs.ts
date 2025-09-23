import { ObjectType } from "@nestjs/graphql";

import { PaginatedResponseFactory } from "../../common/pagination/paginated-response.factory";
import { ActionLog } from "../entities/action-log.entity";

@ObjectType()
export class PaginatedActionLogs extends PaginatedResponseFactory.create(ActionLog) {}
