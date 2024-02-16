import { Query, Resolver } from "@nestjs/graphql";

import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";

@Resolver()
export class SitePreviewResolver {
    @Query(() => Boolean)
    @RequiredPermission(["pageTree"])
    isAllowedSitePreview(): boolean {
        return true; // Validation is done via RequiredPermission decorator
    }
}
