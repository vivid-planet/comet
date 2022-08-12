import { OffsetBasedPaginationArgs, SortDirection } from "@comet/cms-api";
import { ArgsType, Field, InputType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";

import { NewsCategory, NewsContentScope } from "../entities/news.entity";

@InputType()
export class NewsSort {
    @Field(() => SortDirection, { nullable: true })
    @IsEnum(SortDirection)
    @IsOptional()
    title: SortDirection;

    @Field(() => SortDirection, { nullable: true })
    @IsEnum(SortDirection)
    @IsOptional()
    slug: SortDirection;

    @Field(() => SortDirection, { nullable: true })
    @IsEnum(SortDirection)
    @IsOptional()
    category: SortDirection;

    @Field(() => SortDirection, { nullable: true })
    @IsEnum(SortDirection)
    @IsOptional()
    date: SortDirection;

    @Field(() => SortDirection, { nullable: true })
    @IsEnum(SortDirection)
    @IsOptional()
    visible: SortDirection;

    @Field(() => SortDirection, { nullable: true })
    @IsEnum(SortDirection)
    @IsOptional()
    updatedAt: SortDirection;

    @Field(() => SortDirection, { nullable: true })
    @IsEnum(SortDirection)
    @IsOptional()
    createdAt: SortDirection;
}

@ArgsType()
export class NewsListArgs extends OffsetBasedPaginationArgs {
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

    @Field(() => [NewsSort], { nullable: true })
    @Type(() => NewsSort)
    @ValidateNested({ each: true })
    sort: NewsSort[];
}
