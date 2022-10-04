import { BlockInputInterface } from "@comet/blocks-api";
import { Field, InputType } from "@nestjs/graphql";
import { IsEnum, IsOptional } from "class-validator";

import { RedirectGenerationType, RedirectSourceTypeValues } from "../redirects.enum";
import { IsValidRedirectSource } from "../validators/isValidRedirectSource";

@InputType({ isAbstract: true })
export abstract class RedirectBaseInput {
    @IsEnum(RedirectSourceTypeValues)
    @Field(() => RedirectSourceTypeValues)
    sourceType: RedirectSourceTypeValues;

    @IsValidRedirectSource()
    @Field()
    source: string;

    /* TO BE OVERWRITTEN IN APP
    @Transform(({ value }) => linkBlock.blockInputFactory(value), { toClassOnly: true })
    @ValidateNested()
    @Field(() => GraphQLJSONObject)
    target: ExtractBlockInput<typeof linkBlock>;
    */
    abstract target: BlockInputInterface;

    @IsOptional()
    @Field({ nullable: true })
    comment?: string;

    @IsOptional()
    @Field({ nullable: true })
    active?: boolean;

    @IsEnum(RedirectGenerationType)
    @Field(() => RedirectGenerationType)
    generationType: RedirectGenerationType;
}
