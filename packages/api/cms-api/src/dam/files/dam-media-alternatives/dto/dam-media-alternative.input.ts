import { Field, ID, InputType } from "@nestjs/graphql";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

import { PartialType } from "../../../../common/helper/partial-type.helper";
import { DamMediaAlternativeType } from "../entities/dam-media-alternative.entity";

@InputType()
export class DamMediaAlternativeInput {
    @IsNotEmpty()
    @IsString()
    @Field()
    language: string;

    @IsNotEmpty()
    @IsEnum(DamMediaAlternativeType)
    @Field(() => DamMediaAlternativeType)
    type: DamMediaAlternativeType;

    @IsNotEmpty()
    @Field(() => ID)
    @IsString()
    source: string;

    @IsNotEmpty()
    @Field(() => ID)
    @IsString()
    target: string;
}

@InputType()
export class DamMediaAlternativeUpdateInput extends PartialType(DamMediaAlternativeInput) {}
