import { Field, InputType } from "@nestjs/graphql";
import { IsNumber, IsString } from "class-validator";

@InputType()
export class ProductInput {
    @Field()
    @IsString()
    name: string;

    @Field()
    @IsString()
    description: string;

    @Field()
    @IsNumber()
    price: number;
}

// For different requirements with Update and Create, you can use Mapped Types (https://docs.nestjs.com/graphql/mapped-types)
