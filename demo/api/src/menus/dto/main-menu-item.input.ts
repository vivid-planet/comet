import { BlockInputInterface } from "@comet/blocks-api";
import { IsUndefinable, RootBlockInputScalar } from "@comet/cms-api";
import { Field, InputType } from "@nestjs/graphql";
import { RichTextBlock } from "@src/common/blocks/rich-text.block";
import { Transform } from "class-transformer";
import { ValidateNested } from "class-validator";

@InputType()
export class MainMenuItemInput {
    @Field(() => RootBlockInputScalar(RichTextBlock), { nullable: true })
    @IsUndefinable()
    @Transform(({ value }) => RichTextBlock.blockInputFactory(value), { toClassOnly: true })
    @ValidateNested()
    content?: BlockInputInterface;
}
