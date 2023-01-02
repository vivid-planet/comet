import { ArgsType, Field, InputType, Int } from "@nestjs/graphql";
import { IsInt, Max, Min } from "class-validator";

@InputType()
export class OffsetBasedPaginationInput {
    @Field(() => Int, { defaultValue: 0 })
    @IsInt()
    @Min(0)
    offset: number;

    @Field(() => Int, { defaultValue: 20 })
    @Min(1)
    @Max(100)
    limit: number;
}

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
