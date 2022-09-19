import { Field, InputType } from "@nestjs/graphql";
import { IsBoolean, IsOptional } from "class-validator";

@InputType()
export class BooleanFilter {
    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    eq?: boolean;
}
