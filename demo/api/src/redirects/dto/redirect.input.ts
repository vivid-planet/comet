import { ExtractBlockInput } from "@comet/blocks-api";
import { RedirectBaseInput } from "@comet/cms-api";
import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { ValidateNested } from "class-validator";
import { GraphQLJSONObject } from "graphql-type-json";

import { RedirectsLinkBlock } from "../blocks/link.block";

@InputType("RedirectInput")
export class RedirectInput extends RedirectBaseInput {
    @Transform(({ value }) => RedirectsLinkBlock.blockInputFactory(value), { toClassOnly: true })
    @ValidateNested()
    @Field(() => GraphQLJSONObject)
    target: ExtractBlockInput<typeof RedirectsLinkBlock>;
}
