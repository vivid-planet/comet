import { ArgsType, Field, Int } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min, ValidateNested } from "class-validator";

import { SortInput } from "../sorting/sort.input";

@ArgsType()
export class OffsetBasedPaginationArgs {
    @Field(() => Int, { defaultValue: 0 })
    @IsInt()
    @Min(0)
    offset: number;

    @Field(() => Int, { defaultValue: 20 })
    @Min(1)
    @Max(100)
    limit: number;

    @Field(() => SortInput, { nullable: true })
    @IsOptional()
    @ValidateNested()
    @Type(() => SortInput)
    sort?: SortInput;
}
