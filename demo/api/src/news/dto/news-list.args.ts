import { OffsetBasedPaginationArgs, SortArgs } from "@comet/cms-api";
import { ArgsType, Field, IntersectionType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";

import { NewsCategory, NewsContentScope } from "../entities/news.entity";

@ArgsType()
export class NewsListArgs extends IntersectionType(OffsetBasedPaginationArgs, SortArgs) {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    query?: string;

    @Field(() => NewsCategory, { nullable: true })
    @IsEnum(NewsCategory)
    @IsOptional()
    category?: NewsCategory;

    @Field(() => NewsContentScope)
    @Type(() => NewsContentScope)
    @ValidateNested()
    scope: NewsContentScope;
}
