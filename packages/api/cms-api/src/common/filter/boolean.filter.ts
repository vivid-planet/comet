import { Field, InputType } from "@nestjs/graphql";
import { IsBoolean, IsOptional } from "class-validator";

@InputType()
export class BooleanFilter {
    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    equal?: boolean;

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    notEqual?: boolean;

    @Field(() => [Boolean], { nullable: true })
    @IsOptional()
    @IsBoolean({ each: true })
    isAnyOf?: boolean[];
}
