// This file has been generated by comet api-generator.
// You may choose to use this file as scaffold by moving this file out of generated folder and removing this comment.
import { BlockInputInterface, isBlockInputInterface } from "@comet/blocks-api";
import { IsNullable, PartialType, RootBlockInputScalar } from "@comet/cms-api";
import { Field, ID, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";

import { FormBuilderBlock } from "../../blocks/form-builder.block";

@InputType()
export class FormBuilderInput {
    @IsNotEmpty()
    @IsString()
    @Field()
    name: string;

    @IsNotEmpty()
    @Field(() => RootBlockInputScalar(FormBuilderBlock))
    @Transform(({ value }) => (isBlockInputInterface(value) ? value : FormBuilderBlock.blockInputFactory(value)), { toClassOnly: true })
    @ValidateNested()
    blocks: BlockInputInterface;

    @Field(() => [ID], { defaultValue: [] })
    @IsArray()
    @IsString({ each: true })
    requests: string[];

    @IsNullable()
    @IsString()
    @Field({ nullable: true, defaultValue: null })
    submitButtonText?: string;
}

@InputType()
export class FormBuilderUpdateInput extends PartialType(FormBuilderInput) {}