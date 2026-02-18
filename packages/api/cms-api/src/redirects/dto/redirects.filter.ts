import { Field, InputType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";

import { BooleanFilter } from "../../common/filter/boolean.filter";
import { DateTimeFilter } from "../../common/filter/date-time.filter";
import { createEnumFilter } from "../../common/filter/enum.filter.factory";
import { StringFilter } from "../../common/filter/string.filter";
import { RedirectSourceTypeValues } from "../redirects.enum";

@InputType()
class RedirectSourceTypeValuesEnumFilter extends createEnumFilter(RedirectSourceTypeValues) {}

@InputType()
export class RedirectFilter {
    @Field(() => StringFilter, { nullable: true })
    @IsOptional()
    @Type(() => StringFilter)
    generationType?: StringFilter;

    @Field(() => StringFilter, { nullable: true })
    @IsOptional()
    @Type(() => StringFilter)
    source?: StringFilter;

    @Field(() => StringFilter, { nullable: true })
    @IsOptional()
    @Type(() => StringFilter)
    target?: StringFilter;

    @Field(() => BooleanFilter, { nullable: true })
    @ValidateNested()
    @Type(() => BooleanFilter)
    active?: BooleanFilter;

    @Field(() => RedirectSourceTypeValuesEnumFilter, { nullable: true })
    @ValidateNested()
    @IsOptional()
    @Type(() => RedirectSourceTypeValuesEnumFilter)
    sourceType?: RedirectSourceTypeValuesEnumFilter;

    @Field(() => DateTimeFilter, { nullable: true })
    @ValidateNested()
    @Type(() => DateTimeFilter)
    activatedAt?: DateTimeFilter;

    @Field(() => DateTimeFilter, { nullable: true })
    @ValidateNested()
    @Type(() => DateTimeFilter)
    createdAt?: DateTimeFilter;

    @Field(() => DateTimeFilter, { nullable: true })
    @ValidateNested()
    @Type(() => DateTimeFilter)
    updatedAt?: DateTimeFilter;

    @Field(() => [RedirectFilter], { nullable: true })
    @Type(() => RedirectFilter)
    @ValidateNested({ each: true })
    and?: RedirectFilter[];

    @Field(() => [RedirectFilter], { nullable: true })
    @Type(() => RedirectFilter)
    @ValidateNested({ each: true })
    or?: RedirectFilter[];
}
