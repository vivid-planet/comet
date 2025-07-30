import { ObjectType } from "@nestjs/graphql";

import { PaginatedResponseFactory } from "../../../../common/pagination/paginated-response.factory";
import { DamMediaAlternative } from "../entities/dam-media-alternative.entity";

@ObjectType()
export class PaginatedDamMediaAlternatives extends PaginatedResponseFactory.create(DamMediaAlternative) {}
