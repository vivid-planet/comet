import { Field, InputType, Int } from "@nestjs/graphql";
import { IsInt } from "class-validator";

@InputType()
export class RemoveBrevoContactInput {
    @Field(() => Int)
    @IsInt()
    brevoContactId: number;
}
