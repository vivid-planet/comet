// This file has been generated by comet api-generator.
// You may choose to use this file as scaffold by moving this file out of generated folder and removing this comment.
import { OffsetBasedPaginationArgs } from "@comet/cms-api";
import { ArgsType, Field } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsOptional, IsString, ValidateNested } from "class-validator";

import { FormRequestFilter } from "./form-request.filter";
import { FormRequestSort } from "./form-request.sort";

@ArgsType()
export class FormRequestsArgs extends OffsetBasedPaginationArgs {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    search?: string;

    @Field(() => FormRequestFilter, { nullable: true })
    @ValidateNested()
    @Type(() => FormRequestFilter)
    @IsOptional()
    filter?: FormRequestFilter;

    @Field(() => [FormRequestSort], { nullable: true })
    @ValidateNested({ each: true })
    @Type(() => FormRequestSort)
    @IsOptional()
    sort?: FormRequestSort[];
}