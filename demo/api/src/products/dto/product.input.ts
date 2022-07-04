import { Field, InputType } from "@nestjs/graphql";
import { IsString } from "class-validator";

@InputType()
export class ProductInput {
    @Field()
    @IsString()
    name: string;

    @Field()
    @IsString()
    description: string;
}

// For different requirements with Update and Create, you can use Mapped Types (https://docs.nestjs.com/graphql/mapped-types)
