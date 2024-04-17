import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class TranslationInput {
    @IsNotEmpty()
    @IsString()
    @Field()
    text: string;

    @IsNotEmpty()
    @IsString()
    @Field()
    targetLanguage: string;
}
