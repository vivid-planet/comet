import { BlockInputInterface } from "@comet/blocks-api";
import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { ValidateNested } from "class-validator";
import { GraphQLJSONObject } from "graphql-type-json";

import { PageContentBlock } from "../blocks/PageContentBlock";
import { SeoBlock } from "../blocks/seo.block";

@InputType()
export class PageInput {
    @Field(() => GraphQLJSONObject)
    @Transform(({ value }) => PageContentBlock.blockInputFactory(value), { toClassOnly: true })
    @ValidateNested()
    content: BlockInputInterface;

    @Field(() => GraphQLJSONObject)
    @Transform(({ value }) => SeoBlock.blockInputFactory(value), { toClassOnly: true })
    @ValidateNested()
    seo: BlockInputInterface;
}
