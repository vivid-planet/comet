import { Type } from "@nestjs/common";
import { ArgsType, Field } from "@nestjs/graphql";
import { Type as TransformerType } from "class-transformer";
import { IsBoolean, IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";

import { SortArgs } from "../../common/sorting/sort.args";
import { SortDirection } from "../../common/sorting/sort-direction.enum";
import { RedirectGenerationType } from "../redirects.enum";
import { RedirectScopeInterface } from "../types";
import { EmptyRedirectScope } from "./empty-redirect-scope";

interface RedirectsArgsInterface {
    scope: RedirectScopeInterface;
    query?: string;
    type?: RedirectGenerationType;
    active?: boolean;
    sortColumnName?: string;
    sortDirection?: SortDirection;
}

export class RedirectsArgsFactory {
    static create({ Scope }: { Scope: Type<RedirectScopeInterface> }): Type<RedirectsArgsInterface> {
        @ArgsType()
        class RedirectsArgs extends SortArgs implements RedirectsArgsInterface {
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
        }
        return RedirectsArgs;
    }
}
