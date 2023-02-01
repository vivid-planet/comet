import { Type } from "@nestjs/common";
import { ArgsType, Field, ID, InputType, IntersectionType } from "@nestjs/graphql";
import { Type as TransformerType } from "class-transformer";
import { IsBoolean, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";

import { OffsetBasedPaginationArgs } from "../../../common/pagination/offset-based.args";
import { SortArgs } from "../../../common/sorting/sort.args";
import { DamScopeInterface } from "../../types";
import { EmptyDamScope } from "./empty-dam-scope";

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

export interface DamItemsArgsInterface extends OffsetBasedPaginationArgs, SortArgs {
    scope: DamScopeInterface;
    folderId?: string;
    includeArchived?: boolean;
    filter?: DamItemFilterInput;
}

export function createDamItemArgs({ Scope }: { Scope: Type<DamScopeInterface> }): Type<DamItemsArgsInterface> {
    @ArgsType()
    class DamItemsArgs extends IntersectionType(OffsetBasedPaginationArgs, SortArgs) implements DamItemsArgsInterface {
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
        @IsBoolean()
        includeArchived?: boolean;

        @Field(() => DamItemFilterInput, { nullable: true })
        @TransformerType(() => DamItemFilterInput)
        @IsOptional()
        @ValidateNested()
        filter?: DamItemFilterInput;
    }

    return DamItemsArgs;
}
