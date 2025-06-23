import { Field, InputType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";

import { StringFilter } from "../../../../common/filter/string.filter";

@InputType()
export class DamMediaAlternativeFilter {
    @Field(() => StringFilter, { nullable: true })
    @ValidateNested()
    @IsOptional()
    @Type(() => StringFilter)
    id?: StringFilter;

    @Field(() => StringFilter, { nullable: true })
    @ValidateNested()
    @IsOptional()
    @Type(() => StringFilter)
    language?: StringFilter;

    @Field(() => [DamMediaAlternativeFilter], { nullable: true })
    @Type(() => DamMediaAlternativeFilter)
    @ValidateNested({ each: true })
    @IsOptional()
    and?: DamMediaAlternativeFilter[];

    @Field(() => [DamMediaAlternativeFilter], { nullable: true })
    @Type(() => DamMediaAlternativeFilter)
    @ValidateNested({ each: true })
    @IsOptional()
    or?: DamMediaAlternativeFilter[];
}
