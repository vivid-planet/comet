import { OffsetBasedPaginationArgs, SortDirection } from "@comet/cms-api";
import { ArgsType, Field, InputType, registerEnumType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";

import { NewsCategory, NewsContentScope } from "../entities/news.entity";

export enum NewsSortField {
    Title = "Title",
    Slug = "Slug",
    Category = "Category",
    Date = "Date",
    Visible = "Visible",
    UpdatedAt = "UpdatedAt",
    CreatedAt = "CreatedAt",
}
registerEnumType(NewsSortField, {
    name: "NewsSortField",
});

@InputType()
export class NewsSort {
    @Field(() => NewsSortField)
    @IsEnum(NewsSortField)
    field: NewsSortField;

    @Field(() => SortDirection, { defaultValue: SortDirection.ASC })
    @IsEnum(SortDirection)
    direction: SortDirection = SortDirection.ASC;
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
