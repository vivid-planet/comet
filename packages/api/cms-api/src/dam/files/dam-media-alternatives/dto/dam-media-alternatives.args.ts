import { ArgsType, Field, ID } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsEnum, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";

import { OffsetBasedPaginationArgs } from "../../../../common/pagination/offset-based.args";
import { DamMediaAlternativeType } from "../entities/dam-media-alternative.entity";
import { DamMediaAlternativeSort } from "./dam-media-alternative.sort";

@ArgsType()
export class DamMediaAlternativesArgs extends OffsetBasedPaginationArgs {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    search?: string;

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

    @Field(() => DamMediaAlternativeType, { nullable: true })
    @IsOptional()
    @IsEnum(DamMediaAlternativeType)
    type?: DamMediaAlternativeType;
}
