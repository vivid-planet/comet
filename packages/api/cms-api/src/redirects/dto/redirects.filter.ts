import { Field, InputType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";

import { BooleanFilter } from "../../common/filter/boolean.filter";
import { DateFilter } from "../../common/filter/date.filter";
import { StringFilter } from "../../common/filter/string.filter";

@InputType()
export class RedirectFilter {
    @Field(() => StringFilter, { nullable: true })
    @IsOptional()
    @Type(() => StringFilter)
    generationType?: StringFilter;

    @Field(() => BooleanFilter, { nullable: true })
    @ValidateNested()
    @Type(() => BooleanFilter)
    active?: BooleanFilter;

    @Field(() => DateFilter, { nullable: true })
    @ValidateNested()
    @Type(() => DateFilter)
    createdAt?: DateFilter;

    @Field(() => DateFilter, { nullable: true })
    @ValidateNested()
    @Type(() => DateFilter)
    updatedAt?: DateFilter;

    @Field(() => [RedirectFilter], { nullable: true })
    @Type(() => RedirectFilter)
    @ValidateNested({ each: true })
    and?: RedirectFilter[];

    @Field(() => [RedirectFilter], { nullable: true })
    @Type(() => RedirectFilter)
    @ValidateNested({ each: true })
    or?: RedirectFilter[];
}
