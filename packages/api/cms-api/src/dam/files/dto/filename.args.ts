import { Field, ID, InputType, ObjectType } from "@nestjs/graphql";
import { IsOptional, IsString, IsUUID } from "class-validator";

@InputType()
export class FilenameInput {
    @Field()
    @IsString()
    name: string;

    @Field(() => ID, { nullable: true })
    @IsOptional()
    @IsUUID()
    folderId?: string;
}

@ObjectType()
export class FilenameResponse {
    @Field()
    originalName: string;

    @Field(() => ID, { nullable: true })
    folderId?: string;

    @Field(() => Boolean)
    isOccupied: boolean;

    @Field({ nullable: true })
    alternativeName?: string;
}
