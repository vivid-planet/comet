import { ObjectType } from "@nestjs/graphql";
import { PaginatedResponseFactory } from "@comet/cms-api";
import { {{EntityName}} } from "../entities/{{entity-name}}.entity";

@ObjectType()
export class Paginated{{EntityNames}} extends PaginatedResponseFactory.create({{EntityName}}) {}
