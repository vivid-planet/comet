import { Inject } from "@nestjs/common";
import { Args, ArgsType, Field, Query, Resolver } from "@nestjs/graphql";
import { IsObject, IsString } from "class-validator";
import { GraphQLJSONObject } from "graphql-type-json";
import jsonwebtoken from "jsonwebtoken";

import { SITE_PREVIEW_CONFIG } from "./page-tree.constants";

@ArgsType()
class SitePreviewArgs {
    @Field(() => String)
    @IsString()
    path: string;

    @Field(() => GraphQLJSONObject)
    @IsObject()
    previewData: JSON;
}

export type SitePreviewConfig = {
    secret: string;
};

@Resolver()
export class SitePreviewResolver {
    constructor(@Inject(SITE_PREVIEW_CONFIG) private readonly config: SitePreviewConfig) {}

    @Query(() => String)
    getSitePreviewJwt(@Args() args: SitePreviewArgs): string {
        return jsonwebtoken.sign({ ...args }, this.config.secret, { expiresIn: 10 });
    }
}
