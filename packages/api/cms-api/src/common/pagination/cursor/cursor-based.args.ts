import { ArgsType, Field, ID, Int } from "@nestjs/graphql";
import { IsOptional, IsPositive, IsString, ValidateIf } from "class-validator";

@ArgsType()
export class CursorBasedPaginationArgs {
    @Field(() => Int, { nullable: true })
    @ValidateIf(({ after, first }) => first || after)
    // TODO: readd
    // @IsPropertyNotDefined("last", { message })
    @IsPositive()
    first?: number;

    @Field(() => ID, { nullable: true })
    @IsOptional()
    @IsString()
    after?: string;

    @Field(() => Int, { nullable: true })
    @ValidateIf(({ before, last }) => last || before)
    // TODO: readd
    // @IsPropertyNotDefined("first", { message })
    @IsPositive()
    last?: number;

    @Field(() => ID, { nullable: true })
    @ValidateIf(({ last }) => last)
    @IsString()
    before?: string;
}
