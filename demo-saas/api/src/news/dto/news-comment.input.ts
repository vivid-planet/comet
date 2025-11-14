import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class NewsCommentInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    comment: string;
}
