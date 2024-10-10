import { Field, InputType } from "@nestjs/graphql";
import { IsEnum, IsOptional } from "class-validator";

import { PredefinedPageType } from "../entities/predefined-page.entity";

@InputType()
export class PredefinedPageInput {
    @Field(() => PredefinedPageType, { nullable: true })
    @IsEnum(PredefinedPageType)
    @IsOptional()
    type?: PredefinedPageType;
}
