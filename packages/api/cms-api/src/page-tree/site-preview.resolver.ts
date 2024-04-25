import { Inject } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";

import { GetCurrentUser } from "../auth/decorators/get-current-user.decorator";
import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
import { CurrentUser } from "../user-permissions/dto/current-user";
import { ContentScope } from "../user-permissions/interfaces/content-scope.interface";
import { ACCESS_CONTROL_SERVICE } from "../user-permissions/user-permissions.constants";
import { AccessControlServiceInterface } from "../user-permissions/user-permissions.types";

@Resolver()
export class SitePreviewResolver {
    constructor(@Inject(ACCESS_CONTROL_SERVICE) private accessControlService: AccessControlServiceInterface) {}

    @Query(() => Boolean)
    @RequiredPermission(["pageTree"], { skipScopeCheck: true })
    isAllowedSitePreview(@GetCurrentUser() user: CurrentUser, @Args("scope", { type: () => GraphQLJSONObject }) scope: ContentScope): boolean {
        return this.accessControlService.isAllowed(user, "pageTree", scope);
    }
}
