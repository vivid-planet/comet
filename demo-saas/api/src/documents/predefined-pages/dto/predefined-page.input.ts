import { IsNullable, IsUndefinable } from "@comet/cms-api";
import { Field, InputType } from "@nestjs/graphql";
import { IsEnum } from "class-validator";

import { PredefinedPageType } from "../entities/predefined-page.entity";

@InputType()
export class PredefinedPageInput {
    @Field(() => PredefinedPageType, { nullable: true })
    @IsEnum(PredefinedPageType)
    @IsUndefinable()
    @IsNullable()
    type?: PredefinedPageType | null;
}
