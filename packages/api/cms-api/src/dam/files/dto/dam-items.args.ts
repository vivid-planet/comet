import { ArgsType, Field, ID, InputType, IntersectionType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsBoolean, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";

import { OffsetBasedPaginationArgs } from "../../../common/pagination/offset-based.args";
import { SortArgs } from "../../../common/sorting/sort.args";
import { FileFilterInput } from "./file.args";
import { FolderFilterInput } from "./folder.args";

// @InputType()
// class FolderSpecificFilters extends OmitType(FolderFilterInput, ["searchText"] as const) {}
//
// @InputType()
// class FileSpecificFilters extends OmitType(FileFilterInput, ["searchText"] as const) {}

@InputType()
export class DamItemFilterInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    searchText?: string;

    @Field(() => FolderFilterInput, { nullable: true })
    @Type(() => FolderFilterInput)
    @IsOptional()
    @ValidateNested()
    folderFilters?: FolderFilterInput;

    @Field(() => FileFilterInput, { nullable: true })
    @Type(() => FileFilterInput)
    @IsOptional()
    @ValidateNested()
    fileFilters?: FileFilterInput;
}

@ArgsType()
export class DamItemsArgs extends IntersectionType(OffsetBasedPaginationArgs, SortArgs) {
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
