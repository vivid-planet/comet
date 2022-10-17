import { Field, InputType } from "@nestjs/graphql";
import { IsString } from "class-validator";

@InputType()
export class CreateBuildsInput {
    @IsString({ each: true })
    @Field(() => [String])
    names: string[];
}
