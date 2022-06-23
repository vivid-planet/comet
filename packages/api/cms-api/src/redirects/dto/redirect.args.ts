import { ArgsType, Field } from "@nestjs/graphql";
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";

import { RedirectGenerationType } from "../redirects.enum";

@ArgsType()
export class RedirectArgs {
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
