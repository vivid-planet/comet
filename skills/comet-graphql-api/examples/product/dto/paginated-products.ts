import { ObjectType } from "@nestjs/graphql";
import { PaginatedResponseFactory } from "@comet/cms-api";
import { Product } from "../../entities/product.entity";
@ObjectType()
export class PaginatedProducts extends PaginatedResponseFactory.create(Product) {}
