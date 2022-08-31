import { BlockInputInterface, isBlockInputInterface } from "@comet/blocks-api";
import { DamImageBlock, IsSlug } from "@comet/cms-api";
import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { GraphQLJSONObject } from "graphql-type-json";

import { NewsContentBlock } from "../blocks/news-content.block";
import { NewsCategory } from "../entities/news.entity";

@InputType()
export class NewsInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    title: string;

    @Field()
    @IsSlug()
    slug: string;

    @Field()
    @IsDate()
    @IsNotEmpty()
    date: Date;

    @Field(() => NewsCategory)
    @IsEnum(NewsCategory)
    category: NewsCategory;

    @Field(() => GraphQLJSONObject)
    @Transform((value) => (isBlockInputInterface(value) ? value : DamImageBlock.blockInputFactory(value)), { toClassOnly: true })
    @ValidateNested()
    image: BlockInputInterface;

    @Field(() => GraphQLJSONObject)
    @Transform((value) => (isBlockInputInterface(value) ? value : NewsContentBlock.blockInputFactory(value)), { toClassOnly: true })
    @ValidateNested()
    content: BlockInputInterface;
}
