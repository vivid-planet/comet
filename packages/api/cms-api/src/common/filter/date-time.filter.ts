import { Field, InputType } from "@nestjs/graphql";
import { IsBoolean, IsDate, IsOptional } from "class-validator";

@InputType()
export class DateTimeFilter {
    @Field({ nullable: true })
    @IsOptional()
    @IsDate()
    equal?: Date;

    @Field({ nullable: true })
    @IsOptional()
    @IsDate()
    lowerThan?: Date;

    @Field({ nullable: true })
    @IsOptional()
    @IsDate()
    greaterThan?: Date;

    @Field({ nullable: true })
    @IsOptional()
    @IsDate()
    lowerThanEqual?: Date;

    @Field({ nullable: true })
    @IsOptional()
    @IsDate()
    greaterThanEqual?: Date;

    @Field({ nullable: true })
    @IsOptional()
    @IsDate()
    notEqual?: Date;

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    isEmpty?: boolean;

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    isNotEmpty?: boolean;
}
