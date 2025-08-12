import { ArgsType, Field } from "@nestjs/graphql";
import { Type as TransformerType } from "class-transformer";
import { IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { GraphQLJSONObject } from "graphql-scalars";

import { OffsetBasedPaginationArgs } from "../../common/pagination/offset-based.args";
import { ContentScope } from "../../user-permissions/interfaces/content-scope.interface";
import { ActionLogFilter } from "./action-log.filter";
import { ActionLogSort } from "./action-log.sort";

@ArgsType()
export class PaginatedActionLogsArgs extends OffsetBasedPaginationArgs {
    @Field(() => GraphQLJSONObject, { nullable: true })
    @IsOptional()
    @IsObject()
    scope?: ContentScope;

    @Field(() => String)
    @IsString()
    entityName: string;

    @Field(() => ActionLogFilter, { nullable: true })
    @ValidateNested()
    @TransformerType(() => ActionLogFilter)
    filter?: ActionLogFilter;

    @Field(() => [ActionLogSort], { nullable: true })
    @ValidateNested({ each: true })
    @TransformerType(() => ActionLogSort)
    sort?: ActionLogSort[];
}
