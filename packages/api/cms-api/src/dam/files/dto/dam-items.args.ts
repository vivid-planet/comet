import { ArgsType, Field, ID, InputType, Int, IntersectionType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsBoolean, IsOptional, IsPositive, IsString, IsUUID, ValidateIf, ValidateNested } from "class-validator";

import { CursorBasedPaginationArgs } from "../../../common/pagination/cursor/cursor-based.args";
import { SortArgs } from "../../../common/sorting/sort.args";

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

@InputType()
export class DamItemFilterInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    searchText?: string;

    @Field(() => [String], { nullable: true })
    @IsOptional()
    @IsString({ each: true })
    mimetypes?: string[];
}

@ArgsType()
export class DamItemsArgs extends IntersectionType(CursorBasedPaginationArgs, SortArgs) {
    @Field(() => ID, { nullable: true })
    @IsOptional()
    @IsUUID()
    folderId?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    includeArchived?: boolean;

    @Field(() => DamItemFilterInput, { nullable: true })
    @Type(() => DamItemFilterInput)
    @IsOptional()
    @ValidateNested()
    filter?: DamItemFilterInput;
}
