import { Field, InputType } from "@nestjs/graphql";
import { IsNumber, IsOptional } from "class-validator";

@InputType()
export class NumberFilter {
    @Field({ nullable: true })
    @IsOptional()
    @IsNumber()
    eq?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsNumber()
    lt?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsNumber()
    gt?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsNumber()
    lte?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsNumber()
    gte?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsNumber()
    neq?: number;
}
