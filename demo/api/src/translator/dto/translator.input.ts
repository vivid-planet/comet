import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class TranslatorInput {
    @IsNotEmpty()
    @IsString()
    @Field()
    text: string;

    @IsNotEmpty()
    @IsString()
    @Field()
    targetLanguage: string;
}
