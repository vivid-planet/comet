import { BlockInputInterface } from "@comet/api-blocks";
import { Field, InputType } from "@nestjs/graphql";
import { LinkBlock } from "@src/common/blocks/linkBlock/link.block";
import { Transform } from "class-transformer";
import { ValidateNested } from "class-validator";
import { GraphQLJSONObject } from "graphql-type-json";

@InputType()
export class LinkInput {
    @Field(() => GraphQLJSONObject)
    @Transform((value) => LinkBlock.blockInputFactory(value), { toClassOnly: true })
    @ValidateNested()
    content: BlockInputInterface;
}
