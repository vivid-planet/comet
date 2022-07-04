import { PaginatedResponseFactory } from "@comet/cms-api";
import { ObjectType } from "@nestjs/graphql";

import { Product } from "../entities/product.entity";

@ObjectType()
export class PaginatedProducts extends PaginatedResponseFactory.create(Product) {}
