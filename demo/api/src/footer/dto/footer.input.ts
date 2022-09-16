import { BlockInputInterface } from "@comet/blocks-api";
import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { ValidateNested } from "class-validator";
import { GraphQLJSONObject } from "graphql-type-json";

import { FooterContentBlock } from "../blocks/footer-content.block";

@InputType()
export class FooterInput {
    @Field(() => GraphQLJSONObject)
    @Transform((value) => FooterContentBlock.blockInputFactory(value), { toClassOnly: true })
    @ValidateNested()
    content: BlockInputInterface;
}
