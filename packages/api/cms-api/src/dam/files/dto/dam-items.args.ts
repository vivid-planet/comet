import { ArgsType, createUnionType, Field, ID, InputType, IntersectionType, registerEnumType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";

import { OffsetBasedPaginationArgs } from "../../../common/pagination/offset-based.args";
import { SortArgs } from "../../../common/sorting/sort.args";
import { File } from "../entities/file.entity";
import { Folder } from "../entities/folder.entity";

export const DamItem = createUnionType({
    name: "DamItem",
    types: () => [File, Folder] as const,
});

export enum DamItemType {
    File = "File",
    Folder = "Folder",
}
registerEnumType(DamItemType, {
    name: "DamItemType",
});

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

@ArgsType()
export class DamItemPositionArgs extends SortArgs {
    @Field(() => ID)
    @IsUUID()
    id: string;

    @Field(() => DamItemType)
    @IsEnum(DamItemType)
    type: DamItemType;

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
