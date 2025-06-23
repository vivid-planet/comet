import { Field, InputType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";

import { createEnumFilter } from "../../../../common/filter/enum.filter.factory";
import { ManyToOneFilter } from "../../../../common/filter/many-to-one.filter";
import { StringFilter } from "../../../../common/filter/string.filter";
import { DamMediaAlternativeType } from "../entities/dam-media-alternative.entity";

@InputType()
class DamMediaAlternativeTypeEnumFilter extends createEnumFilter(DamMediaAlternativeType) {}

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

    @Field(() => DamMediaAlternativeTypeEnumFilter, { nullable: true })
    @ValidateNested()
    @IsOptional()
    @Type(() => DamMediaAlternativeTypeEnumFilter)
    type?: DamMediaAlternativeTypeEnumFilter;

    @Field(() => ManyToOneFilter, { nullable: true })
    @ValidateNested()
    @IsOptional()
    @Type(() => ManyToOneFilter)
    source?: ManyToOneFilter;

    @Field(() => ManyToOneFilter, { nullable: true })
    @ValidateNested()
    @IsOptional()
    @Type(() => ManyToOneFilter)
    target?: ManyToOneFilter;

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
