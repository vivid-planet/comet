import { Field, InputType } from "@nestjs/graphql";
import { IsDecimal, IsString } from "class-validator";

@InputType()
export class ProductInput {
    @Field()
    @IsString()
    name: string;

    @Field()
    @IsString()
    description: string;

    @Field()
    @IsDecimal()
    price: number;
}

// For different requirements with Update and Create, you can use Mapped Types (https://docs.nestjs.com/graphql/mapped-types)
