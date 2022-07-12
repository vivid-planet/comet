import { BlockInputInterface } from "@comet/blocks-api";
import { Field, InputType } from "@nestjs/graphql";
import { Transform, Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { GraphQLJSONObject } from "graphql-type-json";

import { FooterContentBlock } from "../blocks/footer-content.block";
import { FooterContentScope } from "../entities/footer-content-scope.entity";

@InputType()
export class FooterInput {
    @Field(() => GraphQLJSONObject)
    @Transform((value) => FooterContentBlock.blockInputFactory(value), { toClassOnly: true })
    @ValidateNested()
    content: BlockInputInterface;

    @Field(() => FooterContentScope)
    @Type(() => FooterContentScope)
    @ValidateNested()
    scope: FooterContentScope;
}
