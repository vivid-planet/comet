import { ArgsType, Field } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import { GraphQLJSONObject } from "graphql-scalars";

import { OffsetBasedPaginationArgs } from "../../common/pagination/offset-based.args";
import { type ContentScope } from "../../user-permissions/interfaces/content-scope.interface";
import { WarningStatus } from "../entities/warning-status.enum";
import { WarningFilter } from "./warning.filter";
import { WarningSort } from "./warning.sort";

@ArgsType()
export class WarningsArgs extends OffsetBasedPaginationArgs {
    @Field(() => [WarningStatus], { defaultValue: [WarningStatus.open] })
    @IsEnum(WarningStatus, { each: true })
    status: WarningStatus[];

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    search?: string;

    @Field(() => [GraphQLJSONObject])
    @IsOptional()
    scopes: ContentScope[];

    @Field(() => WarningFilter, { nullable: true })
    @ValidateNested()
    @Type(() => WarningFilter)
    @IsOptional()
    filter?: WarningFilter;

    @Field(() => [WarningSort], { nullable: true })
    @ValidateNested({ each: true })
    @Type(() => WarningSort)
    @IsOptional()
    sort?: WarningSort[];
}
