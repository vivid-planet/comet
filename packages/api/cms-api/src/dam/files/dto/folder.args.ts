import { ArgsType, Field, ID, InputType, IntersectionType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsBoolean, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";

import { OffsetBasedPaginationArgs } from "../../../common/pagination/offset-based.args";
import { SortArgs, SortInput } from "../../../common/sorting/sort.args";

@InputType()
export class FolderFilterInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    searchText?: string;
}

@ArgsType()
export class FolderArgs extends IntersectionType(OffsetBasedPaginationArgs, SortArgs) {
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

@InputType()
export class DamFolderListPositionInput extends SortInput {
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
