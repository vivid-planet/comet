import { Field, InputType } from "@nestjs/graphql";
import { IsOptional, IsString } from "class-validator";

@InputType()
export class ManyToOneFilter {
    @Field(() => [String], { nullable: true })
    @IsOptional()
    @IsString({ each: true })
    isAnyOf?: string[];

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    equal?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    notEqual?: string;
}
