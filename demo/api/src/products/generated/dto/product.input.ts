import { IsSlug } from "@comet/cms-api";
import { Field, InputType } from "@nestjs/graphql";
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

import { ProductType } from "../../entities/product.entity";

@InputType()
export class ProductInput {
    @IsNotEmpty()
    @IsString()
    @Field()
    title: string;

    @IsNotEmpty()
    @IsString()
    @IsSlug()
    @Field()
    slug: string;

    @IsNotEmpty()
    @IsString()
    @Field()
    description: string;

    @IsNotEmpty()
    @IsEnum(ProductType)
    @Field(() => ProductType)
    type: ProductType;

    @IsOptional()
    @IsNumber()
    @Field({ nullable: true })
    price?: number;

    @IsNotEmpty()
    @IsBoolean()
    @Field()
    inStock: boolean;
}
