import { ArgsType, Field, Int } from "@nestjs/graphql";
import { IsInt, Max, Min } from "class-validator";

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
}
