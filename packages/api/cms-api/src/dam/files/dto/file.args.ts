import { Type } from "@nestjs/common";
import { ArgsType, Field, ID, InputType, IntersectionType } from "@nestjs/graphql";
import { Type as TransformerType } from "class-transformer";
import { IsArray, IsEnum, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { SortDirection } from "src/common/sorting/sort-direction.enum";

import { OffsetBasedPaginationArgs } from "../../../common/pagination/offset-based.args";
import { SortArgs } from "../../../common/sorting/sort.args";
import { IsNullable } from "../../../common/validators/is-nullable";
import { DamScopeInterface } from "../../types";
import { DamItemFilter, DamItemSort, DamItemSortField } from "./dam-items.args";
import { EmptyDamScope } from "./empty-dam-scope";

@InputType()
export class FileFilter extends DamItemFilter {
    @Field(() => [String], { nullable: true })
    @IsOptional()
    @IsString({ each: true })
    mimetypes?: string[];
}

export interface FileArgsInterface extends OffsetBasedPaginationArgs, SortArgs {
    scope: DamScopeInterface;
    folderId?: string;
    filter?: FileFilter;
    search?: string;
    sort?: FileSort[];
}

export function createFileArgs({ Scope }: { Scope: Type<DamScopeInterface> }): Type<FileArgsInterface> {
    @ArgsType()
    class FileArgs extends IntersectionType(OffsetBasedPaginationArgs, SortArgs) implements FileArgsInterface {
        @Field(() => Scope, { defaultValue: Scope === EmptyDamScope ? {} : undefined })
        @TransformerType(() => Scope)
        @ValidateNested()
        scope: DamScopeInterface;

        @Field(() => ID, { nullable: true })
        @IsOptional()
        @IsUUID()
        folderId?: string;

        @Field(() => FileFilter, { nullable: true })
        @TransformerType(() => FileFilter)
        @IsOptional()
        @ValidateNested()
        filter?: FileFilter;
    }

    return FileArgs;
}

export interface DamFileListPositionArgs extends SortArgs {
    scope: DamScopeInterface;
    folderId?: string;
    filter?: FileFilter;
}

@ArgsType()
export class MoveDamFilesArgs {
    @Field(() => [ID])
    @IsArray()
    @IsUUID(4, { each: true })
    fileIds: string[];

    @Field(() => ID, { nullable: true })
    @IsNullable()
    @IsUUID()
    targetFolderId: string | null;
}

@InputType()
export class FileSort extends DamItemSort {
    @Field(() => DamItemSortField)
    @IsEnum(DamItemSortField)
    field: DamItemSortField;

    @Field(() => SortDirection, { defaultValue: SortDirection.ASC })
    @IsEnum(SortDirection)
    direction: SortDirection = SortDirection.ASC;
}
