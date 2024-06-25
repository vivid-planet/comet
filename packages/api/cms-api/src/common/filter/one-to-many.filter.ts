import { Field, ID, InputType } from "@nestjs/graphql";
import { IsOptional, IsUUID } from "class-validator";

@InputType()
export class OneToManyFilter {
    @Field(() => ID, { nullable: true })
    @IsOptional()
    @IsUUID()
    contains?: string;
}
