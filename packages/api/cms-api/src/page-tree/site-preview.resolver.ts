import { Inject } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-scalars";
import { SignJWT } from "jose";

import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
import { ContentScope } from "../user-permissions/interfaces/content-scope.interface";
import { SITE_PREVIEW_CONFIG } from "./page-tree.constants";

export type SitePreviewConfig = {
    secret: string;
};

@Resolver()
export class SitePreviewResolver {
    constructor(@Inject(SITE_PREVIEW_CONFIG) private readonly config: SitePreviewConfig) {}

    @Query(() => String)
    @RequiredPermission("pageTree")
    async sitePreviewJwt(
        @Args("scope", { type: () => GraphQLJSONObject }) scope: ContentScope,
        @Args("path") path: string,
        @Args("includeInvisible") includeInvisible: boolean,
    ): Promise<string> {
        return new SignJWT({
            scope,
            path,
            previewData: {
                includeInvisible,
            },
        })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("10 seconds")
            .sign(new TextEncoder().encode(this.config.secret));
    }
}
