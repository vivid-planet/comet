import { PaginatedResponseFactory } from "@comet/cms-api";
import { ObjectType } from "@nestjs/graphql";

import { Warning } from "../entities/warning.entity";

@ObjectType()
export class PaginatedWarnings extends PaginatedResponseFactory.create(Warning) {}
