import { Field, InputType, ID, Int } from "@nestjs/graphql";
import { Transform, Type } from "class-transformer";
import { IsString, IsNotEmpty, ValidateNested, IsNumber, IsBoolean, IsDate, IsOptional, IsEnum, IsUUID, IsArray, IsInt, Min } from "class-validator";
import { GraphQLJSONObject } from "graphql-scalars";
import { GraphQLDate } from "graphql-scalars";
import { BlockInputInterface, IsNullable, IsSlug, PartialType, RootBlockInputScalar, isBlockInputInterface } from "@comet/cms-api";


@InputType()
export class ProductNestedProductStatisticsInput {
    @IsNotEmpty()
@IsInt()
@Field(() => Int, )
    views: number;
    
    
}


