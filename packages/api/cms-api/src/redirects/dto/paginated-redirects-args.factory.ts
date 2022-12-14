import { Type } from "@nestjs/common";
import { ArgsType, Field } from "@nestjs/graphql";
import { Type as TransformerType } from "class-transformer";
import { IsBoolean, IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";

import { OffsetBasedPaginationArgs } from "../../common/pagination/offset-based.args";
import { RedirectGenerationType } from "../redirects.enum";
import { RedirectScopeInterface } from "../types";
import { EmptyRedirectScope } from "./empty-redirect-scope";
import { RedirectSort } from "./redirect.sort";

export interface PaginatedRedirectsArgsInterface {
    scope: RedirectScopeInterface;
    query?: string;
    type?: RedirectGenerationType;
    active?: boolean;
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
            query?: string;

            @Field(() => RedirectGenerationType, { nullable: true })
            @IsOptional()
            @IsEnum(RedirectGenerationType)
            type?: RedirectGenerationType;

            @Field({ nullable: true })
            @IsOptional()
            @IsBoolean()
            active?: boolean;

            @Field(() => [RedirectSort], { nullable: true })
            @ValidateNested({ each: true })
            @TransformerType(() => RedirectSort)
            sort?: RedirectSort[];
        }
        return PaginatedRedirectsArgs;
    }
}
