import { Type } from "@nestjs/common";
import { ArgsType, Field } from "@nestjs/graphql";
import { Type as TransformerType } from "class-transformer";
import { IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import { IsUndefinable } from "src/common/validators/is-undefinable";

import { OffsetBasedPaginationArgs } from "../../common/pagination/offset-based.args";
import { PageTreeNodeCategory, PageTreeNodeVisibility, ScopeInterface } from "../types";
import { EmptyPageTreeNodeScope } from "./empty-page-tree-node-scope";
import { PageTreeNodeSort } from "./page-tree-node.sort";

interface PaginatedPageTreeNodesArgsInterface {
    scope: ScopeInterface;
    category?: string;
    sort?: PageTreeNodeSort[];
    offset: number;
    limit: number;
    documentType?: string;
    visibility?: PageTreeNodeVisibility;
}

export class PaginatedPageTreeNodesArgsFactory {
    static create({ Scope }: { Scope: Type<ScopeInterface> }): Type<PaginatedPageTreeNodesArgsInterface> {
        @ArgsType()
        class PageTreeNodesArgs extends OffsetBasedPaginationArgs implements PaginatedPageTreeNodesArgsInterface {
            @Field(() => Scope, { defaultValue: Scope === EmptyPageTreeNodeScope ? {} : undefined })
            @TransformerType(() => Scope)
            @ValidateNested()
            scope: ScopeInterface;

            @Field({ nullable: true })
            @IsOptional()
            category?: PageTreeNodeCategory;

            @Field(() => [PageTreeNodeSort], { nullable: true })
            @TransformerType(() => PageTreeNodeSort)
            @ValidateNested({ each: true })
            sort?: PageTreeNodeSort[];

            @Field({ nullable: true })
            @IsOptional()
            @IsString()
            documentType?: string;

            @Field(() => PageTreeNodeVisibility, { nullable: true })
            @IsUndefinable()
            @IsEnum(PageTreeNodeVisibility)
            visibility?: PageTreeNodeVisibility;
        }
        return PageTreeNodesArgs;
    }
}
