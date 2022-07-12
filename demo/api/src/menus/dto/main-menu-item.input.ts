import { BlockInputInterface } from "@comet/blocks-api";
import { Field, InputType } from "@nestjs/graphql";
import { RichTextBlock } from "@src/common/blocks/rich-text.block";
import { Transform } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";
import { GraphQLJSONObject } from "graphql-type-json";

@InputType()
export class MainMenuItemInput {
    @Field(() => GraphQLJSONObject, { nullable: true })
    @IsOptional()
    @Transform((value) => RichTextBlock.blockInputFactory(value), { toClassOnly: true })
    @ValidateNested()
    content: BlockInputInterface | null;
}
