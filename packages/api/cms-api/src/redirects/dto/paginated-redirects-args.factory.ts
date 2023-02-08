import { Type } from "@nestjs/common";
import { ArgsType, Field } from "@nestjs/graphql";
import { Type as TransformerType } from "class-transformer";
import { IsOptional, IsString, ValidateNested } from "class-validator";

import { OffsetBasedPaginationArgs } from "../../common/pagination/offset-based.args";
import { RedirectScopeInterface } from "../types";
import { EmptyRedirectScope } from "./empty-redirect-scope";
import { RedirectSort } from "./redirect.sort";
import { RedirectFilter } from "./redirects.filter";

export interface PaginatedRedirectsArgsInterface {
    scope: RedirectScopeInterface;
    search?: string;
    filter?: RedirectFilter;
    sort?: RedirectSort[];
    offset: number;
    limit: number;
}

export class PaginatedRedirectsArgsFactory {
    static create({ Scope }: { Scope: Type<RedirectScopeInterface> }): Type<PaginatedRedirectsArgsInterface> {
        @ArgsType()
        class PaginatedRedirectsArgs extends OffsetBasedPaginationArgs implements PaginatedRedirectsArgsInterface {
            @Field(() => Scope, { defaultValue: Scope === EmptyRedirectScope ? {} : undefined })
            @TransformerType(() => Scope)
            @ValidateNested()
            scope: RedirectScopeInterface;

            @Field({ nullable: true })
            @IsOptional()
            @IsString()
            search?: string;

            @Field(() => RedirectFilter, { nullable: true })
            @ValidateNested()
            @TransformerType(() => RedirectFilter)
            filter?: RedirectFilter;

            @Field(() => [RedirectSort], { nullable: true })
            @ValidateNested({ each: true })
            @TransformerType(() => RedirectSort)
            sort?: RedirectSort[];
        }
        return PaginatedRedirectsArgs;
    }
}
