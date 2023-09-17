import { Field, ID, InputType } from "@nestjs/graphql";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

@InputType("CreateDamFolderInput")
export class CreateFolderInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field(() => ID, { nullable: true })
    @IsUUID()
    @IsOptional()
    parentId?: string;

    @Field({ defaultValue: false })
    @IsBoolean()
    isInboxFromOtherScope?: boolean;
}

@InputType("UpdateDamFolderInput")
export class UpdateFolderInput {
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    name?: string;

    @Field(() => ID, { nullable: true })
    @IsUUID()
    @IsOptional()
    parentId?: string;

    @Field({ nullable: true })
    @IsBoolean()
    @IsOptional()
    archived?: boolean;
}
