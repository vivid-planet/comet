import { Inject } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-scalars";
import { SignJWT } from "jose";

import { GetCurrentUser } from "../auth/decorators/get-current-user.decorator.js";
import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator.js";
import { CurrentUser } from "../user-permissions/dto/current-user.js";
import { ContentScope } from "../user-permissions/interfaces/content-scope.interface.js";
import { SITE_PREVIEW_CONFIG } from "./page-tree.constants.js";

type SitePreviewConfig = {
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
        @GetCurrentUser() user: CurrentUser,
    ): Promise<string> {
        return new SignJWT({
            userId: user.id,
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

    @Query(() => String)
    @RequiredPermission("pageTree")
    async blockPreviewJwt(
        @Args("scope", { type: () => GraphQLJSONObject }) scope: ContentScope,
        @Args("url") url: string,
        @Args("includeInvisible") includeInvisible: boolean,
    ): Promise<string> {
        return new SignJWT({
            scope,
            url,
            previewData: {
                includeInvisible,
            },
        })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("1 day")
            .sign(new TextEncoder().encode(this.config.secret));
    }
}
