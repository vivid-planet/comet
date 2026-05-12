import { Field, InputType, Int } from "@nestjs/graphql";
import { IsArray, IsInt } from "class-validator";

@InputType()
export class AddBrevoContactsInput {
    @Field(() => [Int])
    @IsArray()
    @IsInt({ each: true })
    brevoContactIds: number[];
}
