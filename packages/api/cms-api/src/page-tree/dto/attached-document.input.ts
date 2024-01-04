import { Field, InputType } from "@nestjs/graphql";
import { IsOptional, IsString } from "class-validator";

@InputType()
export class AttachedDocumentInput {
    @Field()
    @IsString()
    type: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    id?: string;
}

@InputType()
export class AttachedDocumentStrictInput {
    @Field()
    @IsString()
    type: string;

    @Field()
    @IsString()
    id: string;
}
