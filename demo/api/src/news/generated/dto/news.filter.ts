import { BooleanFilter, createEnumFilter, DateFilter, StringFilter } from "@comet/cms-api";
import { Field, InputType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";

import { NewsCategory } from "../../entities/news.entity";

@InputType()
class NewsCategoryEnumFilter extends createEnumFilter(NewsCategory) {}

@InputType()
export class NewsFilter {
    @Field(() => StringFilter, { nullable: true })
    @ValidateNested()
    @Type(() => StringFilter)
    slug?: StringFilter;

    @Field(() => StringFilter, { nullable: true })
    @ValidateNested()
    @Type(() => StringFilter)
    title?: StringFilter;

    @Field(() => DateFilter, { nullable: true })
    @ValidateNested()
    @Type(() => DateFilter)
    date?: DateFilter;

    @Field(() => NewsCategoryEnumFilter, { nullable: true })
    @ValidateNested()
    @Type(() => NewsCategoryEnumFilter)
    category?: NewsCategoryEnumFilter;

    @Field(() => BooleanFilter, { nullable: true })
    @ValidateNested()
    @Type(() => BooleanFilter)
    visible?: BooleanFilter;

    @Field(() => DateFilter, { nullable: true })
    @ValidateNested()
    @Type(() => DateFilter)
    createdAt?: DateFilter;

    @Field(() => DateFilter, { nullable: true })
    @ValidateNested()
    @Type(() => DateFilter)
    updatedAt?: DateFilter;

    @Field(() => [NewsFilter], { nullable: true })
    @Type(() => NewsFilter)
    @ValidateNested({ each: true })
    and?: NewsFilter[];

    @Field(() => [NewsFilter], { nullable: true })
    @Type(() => NewsFilter)
    @ValidateNested({ each: true })
    or?: NewsFilter[];
}
