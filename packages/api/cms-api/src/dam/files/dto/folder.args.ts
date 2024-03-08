import { Type } from "@nestjs/common";
import { ArgsType, Field, ID, InputType, IntersectionType } from "@nestjs/graphql";
import { Type as TransformerType } from "class-transformer";
import { IsEnum, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { SortDirection } from "src/common/sorting/sort-direction.enum";

import { OffsetBasedPaginationArgs } from "../../../common/pagination/offset-based.args";
import { SortArgs } from "../../../common/sorting/sort.args";
import { DamScopeInterface } from "../../types";
import { DamItemFilter, DamItemSort, DamItemSortField } from "./dam-items.args";
import { EmptyDamScope } from "./empty-dam-scope";

@InputType()
export class FolderFilter extends DamItemFilter {}

export interface FolderArgsInterface extends OffsetBasedPaginationArgs {
    scope: DamScopeInterface;
    parentId?: string;
    search?: string;
    sort?: FolderSort[];
    filter?: FolderFilter;
}

export function createFolderArgs({ Scope }: { Scope: Type<DamScopeInterface> }): Type<FolderArgsInterface> {
    @ArgsType()
    class FolderArgs extends IntersectionType(OffsetBasedPaginationArgs, SortArgs) implements FolderArgsInterface {
        @Field(() => Scope, { defaultValue: Scope === EmptyDamScope ? {} : undefined })
        @TransformerType(() => Scope)
        @ValidateNested()
        scope: DamScopeInterface;

        @Field(() => ID, { nullable: true })
        @IsOptional()
        @IsUUID()
        parentId?: string;

        @Field(() => FolderFilter, { nullable: true })
        @TransformerType(() => FolderFilter)
        @IsOptional()
        @ValidateNested()
        filter?: FolderFilter;
    }

    return FolderArgs;
}

export interface FolderByNameAndParentIdArgsInterface {
    scope: DamScopeInterface;
    name: string;
    parentId?: string;
}

export function createFolderByNameAndParentIdArgs({ Scope }: { Scope: Type<DamScopeInterface> }): Type<FolderByNameAndParentIdArgsInterface> {
    @ArgsType()
    class FolderByNameAndParentIdArgs implements FolderByNameAndParentIdArgsInterface {
        @Field(() => Scope, { defaultValue: Scope === EmptyDamScope ? {} : undefined })
        @TransformerType(() => Scope)
        @ValidateNested()
        scope: DamScopeInterface;

        @Field()
        @IsString()
        name: string;

        @Field(() => ID, { nullable: true })
        @IsOptional()
        @IsUUID()
        parentId?: string;
    }

    return FolderByNameAndParentIdArgs;
}

export interface DamFolderListPositionArgs extends SortArgs {
    scope: DamScopeInterface;
    parentId?: string;
    filter?: FolderFilter;
    sort?: FolderSort[];
    search?: string;
}

@InputType()
export class FolderSort extends DamItemSort {
    @Field(() => DamItemSortField)
    @IsEnum(DamItemSortField)
    field: DamItemSortField;

    @Field(() => SortDirection, { defaultValue: SortDirection.ASC })
    @IsEnum(SortDirection)
    direction: SortDirection = SortDirection.ASC;
}
