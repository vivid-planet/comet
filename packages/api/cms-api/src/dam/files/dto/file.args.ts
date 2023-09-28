import { Type } from "@nestjs/common";
import { ArgsType, Field, ID, InputType, IntersectionType } from "@nestjs/graphql";
import { Type as TransformerType } from "class-transformer";
import { IsArray, IsBoolean, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";

import { OffsetBasedPaginationArgs } from "../../../common/pagination/offset-based.args";
import { SortArgs } from "../../../common/sorting/sort.args";
import { IsNullable } from "../../../common/validators/is-nullable";
import { DamScopeInterface } from "../../types";
import { EmptyDamScope } from "./empty-dam-scope";

@InputType()
export class FileFilterInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    searchText?: string;

    @Field(() => [String], { nullable: true })
    @IsOptional()
    @IsString({ each: true })
    mimetypes?: string[];
}

export interface FileArgsInterface extends OffsetBasedPaginationArgs, SortArgs {
    scope: DamScopeInterface;
    folderId?: string;
    includeArchived?: boolean;
    filter?: FileFilterInput;
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

        @Field({ nullable: true, defaultValue: false })
        @IsOptional()
        @IsBoolean()
        includeArchived?: boolean;

        @Field(() => FileFilterInput, { nullable: true })
        @TransformerType(() => FileFilterInput)
        @IsOptional()
        @ValidateNested()
        filter?: FileFilterInput;
    }

    return FileArgs;
}

export interface DamFileListPositionArgs extends SortArgs {
    scope: DamScopeInterface;
    folderId?: string;
    includeArchived?: boolean;
    filter?: FileFilterInput;
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
