import { Field, ID, InputType } from "@nestjs/graphql";
import { IsOptional, IsUUID } from "class-validator";

@InputType()
export class ManyToOneFilter {
    @Field(() => [ID], { nullable: true })
    @IsOptional()
    @IsUUID(undefined, { each: true })
    isAnyOf?: string[];

    @Field(() => ID, { nullable: true })
    @IsOptional()
    @IsUUID()
    equal?: string;

    @Field(() => ID, { nullable: true })
    @IsOptional()
    @IsUUID()
    notEqual?: string;
}
