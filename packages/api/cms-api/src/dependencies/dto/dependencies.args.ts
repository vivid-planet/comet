import { ArgsType, Field } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";

import { OffsetBasedPaginationArgs } from "../../common/pagination/offset-based.args";
import { DependencyFilter, DependentFilter } from "./dependencies.filter";

@ArgsType()
export class DependenciesArgs extends OffsetBasedPaginationArgs {
    @Field(() => DependencyFilter, { nullable: true })
    @ValidateNested()
    @Type(() => DependencyFilter)
    @IsOptional()
    filter?: DependencyFilter;
}

@ArgsType()
export class DependentsArgs extends OffsetBasedPaginationArgs {
    @Field(() => DependentFilter, { nullable: true })
    @ValidateNested()
    @Type(() => DependentFilter)
    @IsOptional()
    filter?: DependentFilter;
}
