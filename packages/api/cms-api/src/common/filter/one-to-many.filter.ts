import { Field, ID, InputType } from "@nestjs/graphql";
import { IsOptional, IsString, IsUUID } from "class-validator";

@InputType()
export class OneToManyFilter {
    @Field(() => ID, { nullable: true })
    @IsOptional()
    @IsUUID()
    contains?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    search?: string;

    @Field(() => [ID], { nullable: true })
    @IsOptional()
    @IsUUID(undefined, { each: true })
    isAnyOf?: string[];
}
