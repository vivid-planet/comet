import { ArgsType, Field, ID, InputType, IntersectionType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsBoolean, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";

import { CursorBasedPaginationArgs } from "../../../common/pagination/cursor/cursor-based.args";
import { SortArgs } from "../../../common/sorting/sort.args";

export type FolderSortColumn = "createdAt" | "updatedAt" | "name";

@InputType()
export class FolderFilterInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    searchText?: string;
}

@ArgsType()
export class FolderArgs extends IntersectionType(CursorBasedPaginationArgs, SortArgs) {
    @Field(() => ID, { nullable: true })
    @IsOptional()
    @IsUUID()
    parentId?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    includeArchived?: boolean;

    @Field(() => FolderFilterInput, { nullable: true })
    @Type(() => FolderFilterInput)
    @IsOptional()
    @ValidateNested()
    filter?: FolderFilterInput;
}

@ArgsType()
export class FolderByNameAndParentIdArgs {
    @Field()
    @IsString()
    name: string;

    @Field(() => ID, { nullable: true })
    @IsOptional()
    @IsUUID()
    parentId?: string;
}
