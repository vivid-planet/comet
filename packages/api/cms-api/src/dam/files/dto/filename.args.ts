import { Field, ID, InputType, ObjectType } from "@nestjs/graphql";
import { IsOptional, IsString, IsUUID } from "class-validator";

@InputType("FilenameInput")
@ObjectType()
export class Filename {
    @Field(() => ID)
    @IsUUID()
    id: string;

    @Field()
    @IsString()
    name: string;

    @Field(() => ID, { nullable: true })
    @IsOptional()
    @IsUUID()
    folderId?: string;
}
