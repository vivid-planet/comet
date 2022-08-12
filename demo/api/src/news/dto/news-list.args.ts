import { OffsetBasedPaginationArgs } from "@comet/cms-api";
import { ArgsType, Field, registerEnumType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";

import { NewsCategory, NewsContentScope } from "../entities/news.entity";

export enum NewsSortField {
    Title_ASC = "Title_ASC",
    Title_DESC = "Title_DESC",
    Slug_ASC = "Slug_ASC",
    Slug_DESC = "Slug_DESC",
    Category_ASC = "Category_ASC",
    Category_DESC = "Category_DESC",
    Date_ASC = "Date_ASC",
    Date_DESC = "Date_DESC",
    Visible_ASC = "Visible_ASC",
    Visible_DESC = "Visible_DESC",
    UpdatedAt_ASC = "UpdatedAt_ASC",
    UpdatedAt_DESC = "UpdatedAt_DESC",
    CreatedAt_ASC = "CreatedAt_ASC",
    CreatedAt_DESC = "CreatedAt_DESC",
}
registerEnumType(NewsSortField, {
    name: "NewsSortField",
});

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

    @Field(() => [NewsSortField], { nullable: true })
    @IsEnum(NewsSortField, { each: true })
    sort: NewsSortField[];
}
