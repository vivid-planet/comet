import { Field, InputType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";

import { IdFilter } from "../../common/filter/id.filter";
import { StringFilter } from "../../common/filter/string.filter";

@InputType()
export class ActionLogFilter {
    @Field(() => IdFilter, { nullable: true })
    @ValidateNested()
    @IsOptional()
    @Type(() => IdFilter)
    id?: IdFilter;

    @Field(() => StringFilter, { nullable: true })
    @ValidateNested()
    @IsOptional()
    @Type(() => StringFilter)
    userId?: StringFilter;

    @Field(() => StringFilter, { nullable: true })
    @ValidateNested()
    @IsOptional()
    @Type(() => StringFilter)
    entityId?: StringFilter;

    @Field(() => [ActionLogFilter], { nullable: true })
    @Type(() => ActionLogFilter)
    @ValidateNested({ each: true })
    @IsOptional()
    and?: ActionLogFilter[];

    @Field(() => [ActionLogFilter], { nullable: true })
    @Type(() => ActionLogFilter)
    @ValidateNested({ each: true })
    @IsOptional()
    or?: ActionLogFilter[];
}
