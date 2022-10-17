import { Field, InputType } from "@nestjs/graphql";
import { IsBoolean } from "class-validator";

@InputType()
export class RedirectUpdateActivenessInput {
    @IsBoolean()
    @Field()
    active: boolean;
}
