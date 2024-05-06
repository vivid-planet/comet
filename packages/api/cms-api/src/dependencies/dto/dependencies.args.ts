import { ArgsType, Field } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsBoolean, ValidateNested } from "class-validator";

import { OffsetBasedPaginationArgs } from "../../common/pagination/offset-based.args";
import { IsUndefinable } from "../../common/validators/is-undefinable";
import { DependencyFilter, DependentFilter } from "./dependencies.filter";

@ArgsType()
export class DependenciesArgs extends OffsetBasedPaginationArgs {
    @Field(() => DependencyFilter, { nullable: true })
    @ValidateNested()
    @Type(() => DependencyFilter)
    @IsUndefinable()
    filter?: DependencyFilter;

    @Field(() => Boolean, { defaultValue: false })
    @IsBoolean()
    forceRefresh: boolean;
}

@ArgsType()
export class DependentsArgs extends OffsetBasedPaginationArgs {
    @Field(() => DependentFilter, { nullable: true })
    @ValidateNested()
    @Type(() => DependentFilter)
    @IsUndefinable()
    filter?: DependentFilter;

    @Field(() => Boolean, { defaultValue: false })
    @IsBoolean()
    forceRefresh: boolean;
}
