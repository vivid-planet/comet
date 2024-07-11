import { Field, InputType, Int } from "@nestjs/graphql";
import { IsArray, IsInt, IsOptional } from "class-validator";

@InputType()
export class ManyToOneIntFilter {
    @Field(() => [Int], { nullable: true })
    @IsOptional()
    @IsArray()
    @IsInt()
    isAnyOf?: number[];

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    equal?: number;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    notEqual?: number;
}
