import { ArgsType, Field, ID } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";

import { OffsetBasedPaginationArgs } from "../../../../common/pagination/offset-based.args";
import { DamMediaAlternativeFilter } from "./dam-media-alternative.filter";
import { DamMediaAlternativeSort } from "./dam-media-alternative.sort";

@ArgsType()
export class DamMediaAlternativesArgs extends OffsetBasedPaginationArgs {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    search?: string;

    @Field(() => DamMediaAlternativeFilter, { nullable: true })
    @ValidateNested()
    @Type(() => DamMediaAlternativeFilter)
    @IsOptional()
    filter?: DamMediaAlternativeFilter;

    @Field(() => [DamMediaAlternativeSort], { nullable: true })
    @ValidateNested({ each: true })
    @Type(() => DamMediaAlternativeSort)
    @IsOptional()
    sort?: DamMediaAlternativeSort[];

    @Field(() => ID, { nullable: true })
    @IsUUID()
    @IsOptional()
    for?: string;

    @Field(() => ID, { nullable: true })
    @IsUUID()
    @IsOptional()
    alternative?: string;
}
