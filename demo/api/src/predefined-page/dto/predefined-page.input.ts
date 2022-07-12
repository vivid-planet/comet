import { Field, InputType } from "@nestjs/graphql";
import { IsOptional, IsString } from "class-validator";

@InputType()
export class PredefinedPageInput {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    type?: string;
}
