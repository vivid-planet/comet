import { Inject } from "@nestjs/common";
import { Args, ArgsType, Field, InputType, Query, Resolver } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsBoolean, IsString, ValidateNested } from "class-validator";
import jsonwebtoken from "jsonwebtoken";

import { SITE_PREVIEW_CONFIG } from "./page-tree.constants";

@InputType()
export class PreviewData {
    @Field(() => Boolean)
    @IsBoolean()
    includeInvisible: boolean;
}

@ArgsType()
class SitePreviewArgs {
    @Field(() => String)
    @IsString()
    path: string;

    @Field(() => PreviewData)
    @ValidateNested()
    @Type(() => PreviewData)
    previewData: PreviewData;
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
