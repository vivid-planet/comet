import { IsSlug } from "@comet/cms-api";
import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class NewsInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    title: string;

    @Field()
    @IsSlug()
    slug: string;
}
