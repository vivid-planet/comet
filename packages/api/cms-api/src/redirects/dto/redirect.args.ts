import { ArgsType, Field } from "@nestjs/graphql";
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";

import { SortArgs } from "../../common/sorting/sort.args";
import { RedirectGenerationType } from "../redirects.enum";

@ArgsType()
export class RedirectArgs extends SortArgs {
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
