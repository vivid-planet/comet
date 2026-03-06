import { ArgsType, Field } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsOptional, IsString, ValidateNested } from "class-validator";
import { OffsetBasedPaginationArgs, SortDirection } from "@comet/cms-api";
import { {{EntityName}}Filter } from "./{{entity-name}}.filter";
import { {{EntityName}}Sort, {{EntityName}}SortField } from "./{{entity-name}}.sort";

@ArgsType()
export class {{EntityNames}}Args extends OffsetBasedPaginationArgs {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    search?: string;

    @Field(() => {{EntityName}}Filter, { nullable: true })
    @ValidateNested()
    @Type(() => {{EntityName}}Filter)
    @IsOptional()
    filter?: {{EntityName}}Filter;

    @Field(() => [{{EntityName}}Sort], { defaultValue: [{ field: {{EntityName}}SortField.createdAt, direction: SortDirection.ASC }] })
    @ValidateNested({ each: true })
    @Type(() => {{EntityName}}Sort)
    sort: {{EntityName}}Sort[];
}
