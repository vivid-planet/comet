import { Field, InputType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";
import { GraphQLJSONObject } from "graphql-scalars";

import { DateTimeFilter } from "../../common/filter/date-time.filter";
import { createEnumFilter, type EnumFilterInterface } from "../../common/filter/enum.filter.factory";
import { IdFilter } from "../../common/filter/id.filter";
import { StringFilter } from "../../common/filter/string.filter";
import { IsUndefinable } from "../../common/validators/is-undefinable";
import { ContentScope } from "../../user-permissions/interfaces/content-scope.interface";
import { ActionLogAction } from "./action-log-action.enum";

@InputType()
class ActionLogActionFilter extends createEnumFilter(ActionLogAction) implements EnumFilterInterface<ActionLogAction> {}

@InputType({ isAbstract: true })
class ActionLogScopeFilter {
    @Field(() => [GraphQLJSONObject], { nullable: true })
    @IsOptional()
    isAnyOf?: ContentScope[];

    @Field(() => GraphQLJSONObject, { nullable: true })
    @IsOptional()
    equal?: ContentScope;

    @Field(() => GraphQLJSONObject, { nullable: true })
    @IsOptional()
    notEqual?: ContentScope;
}

@InputType()
export class ActionLogFilter {
    @Field(() => StringFilter, { nullable: true })
    @ValidateNested()
    @Type(() => StringFilter)
    @IsUndefinable()
    userId?: StringFilter;

    @Field(() => IdFilter, { nullable: true })
    @ValidateNested()
    @Type(() => IdFilter)
    @IsUndefinable()
    entityId?: IdFilter;

    @Field(() => StringFilter, { nullable: true })
    @ValidateNested()
    @Type(() => StringFilter)
    @IsUndefinable()
    entityName?: StringFilter;

    @Field(() => ActionLogActionFilter, { nullable: true })
    @ValidateNested()
    @Type(() => ActionLogActionFilter)
    @IsUndefinable()
    action?: ActionLogActionFilter;

    @Field(() => DateTimeFilter, { nullable: true })
    @ValidateNested()
    @Type(() => DateTimeFilter)
    @IsUndefinable()
    createdAt?: DateTimeFilter;

    @Field(() => ActionLogScopeFilter, { nullable: true })
    @IsOptional()
    scope?: ActionLogScopeFilter;

    @Field(() => [ActionLogFilter], { nullable: true })
    @ValidateNested({ each: true })
    @Type(() => ActionLogFilter)
    @IsUndefinable()
    and?: ActionLogFilter[];

    @Field(() => [ActionLogFilter], { nullable: true })
    @ValidateNested({ each: true })
    @Type(() => ActionLogFilter)
    @IsUndefinable()
    or?: ActionLogFilter[];
}
