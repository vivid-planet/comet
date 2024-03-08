import { Type } from "@nestjs/common";
import { ArgsType, Field, ID, InputType, registerEnumType } from "@nestjs/graphql";
import { Type as TransformerType } from "class-transformer";
import { IsBoolean, IsEnum, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { DateFilter } from "src/common/filter/date.filter";
import { SortDirection } from "src/common/sorting/sort-direction.enum";

import { OffsetBasedPaginationArgs } from "../../../common/pagination/offset-based.args";
import { SortArgs } from "../../../common/sorting/sort.args";
import { DamScopeInterface } from "../../types";
import { EmptyDamScope } from "./empty-dam-scope";

export enum DamItemType {
    File = "File",
    Folder = "Folder",
}
registerEnumType(DamItemType, {
    name: "DamItemType",
});

@InputType()
export class DamItemFilter {
    @Field(() => DateFilter, { nullable: true })
    @ValidateNested()
    @IsOptional()
    @TransformerType(() => DateFilter)
    createdAt?: DateFilter;

    @Field(() => DateFilter, { nullable: true })
    @ValidateNested()
    @IsOptional()
    @TransformerType(() => DateFilter)
    updatedAt?: DateFilter;

    @Field(() => [DamItemFilter], { nullable: true })
    @TransformerType(() => DamItemFilter)
    @ValidateNested({ each: true })
    @IsOptional()
    and?: DamItemFilter[];

    @Field(() => [DamItemFilter], { nullable: true })
    @TransformerType(() => DamItemFilter)
    @ValidateNested({ each: true })
    @IsOptional()
    or?: DamItemFilter[];
}

export interface DamItemsArgsInterface extends OffsetBasedPaginationArgs {
    scope: DamScopeInterface;
    folderId?: string;
    search?: string;
    filter?: DamItemFilter;
    sort?: DamItemSort[];
}

export function createDamItemArgs({ Scope }: { Scope: Type<DamScopeInterface> }): Type<DamItemsArgsInterface> {
    @ArgsType()
    class DamItemsArgs extends OffsetBasedPaginationArgs implements DamItemsArgsInterface {
        @Field(() => Scope, { defaultValue: Scope === EmptyDamScope ? {} : undefined })
        @TransformerType(() => Scope)
        @ValidateNested()
        scope: DamScopeInterface;

        @Field(() => ID, { nullable: true })
        @IsOptional()
        @IsUUID()
        folderId?: string;

        @Field({ nullable: true })
        @IsOptional()
        @IsString()
        search?: string;

        @Field(() => DamItemFilter, { nullable: true })
        @TransformerType(() => DamItemFilter)
        @IsOptional()
        @ValidateNested()
        filter?: DamItemFilter;

        @Field(() => [DamItemSort], { nullable: true })
        @ValidateNested({ each: true })
        @TransformerType(() => DamItemSort)
        @IsOptional()
        sort?: DamItemSort[];
    }

    return DamItemsArgs;
}

export interface DamItemPositionArgsInterface extends SortArgs {
    scope: DamScopeInterface;
    id: string;
    type: DamItemType;
    folderId?: string;
    includeArchived?: boolean;
    filter?: DamItemFilter;
}

export function createDamItemPositionArgs({ Scope }: { Scope: Type<DamScopeInterface> }): Type<DamItemPositionArgsInterface> {
    @ArgsType()
    class DamItemPositionArgs extends SortArgs implements DamItemPositionArgsInterface {
        @Field(() => Scope, { defaultValue: Scope === EmptyDamScope ? {} : undefined })
        @TransformerType(() => Scope)
        @ValidateNested()
        scope: DamScopeInterface;

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

        @Field(() => DamItemFilter, { nullable: true })
        @TransformerType(() => DamItemFilter)
        @IsOptional()
        @ValidateNested()
        filter?: DamItemFilter;
    }

    return DamItemPositionArgs;
}

export enum DamItemSortField {
    name = "name",
    createdAt = "createdAt",
    updatedAt = "updatedAt",
}
registerEnumType(DamItemSortField, {
    name: "DamItemSortField",
});

@InputType()
export class DamItemSort {
    @Field(() => DamItemSortField)
    @IsEnum(DamItemSortField)
    field: DamItemSortField;

    @Field(() => SortDirection, { defaultValue: SortDirection.ASC })
    @IsEnum(SortDirection)
    direction: SortDirection = SortDirection.ASC;
}
