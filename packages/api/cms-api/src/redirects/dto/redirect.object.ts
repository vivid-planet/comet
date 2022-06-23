import { Field, ObjectType } from "@nestjs/graphql";

import { RedirectGenerationType, RedirectSourceTypeValues, RedirectTargetTypeValues } from "../redirects.enum";

@ObjectType("Redirect")
export class RedirectObject {
    _id: string;

    @Field()
    id: string;

    @Field(() => RedirectSourceTypeValues)
    sourceType: RedirectSourceTypeValues;

    @Field()
    source: string;

    @Field(() => RedirectTargetTypeValues)
    targetType: RedirectTargetTypeValues;

    @Field({ nullable: true })
    targetUrl?: string;

    @Field({ nullable: true })
    targetPageId?: string;

    @Field({ nullable: true })
    comment?: string;

    @Field(() => RedirectGenerationType)
    generationType: RedirectGenerationType;
}
