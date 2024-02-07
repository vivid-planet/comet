import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";

import { RequiredPermission } from "./decorators/required-permission.decorator";
import { CurrentUser } from "./dto/current-user";
import { ContentScope } from "./interfaces/content-scope.interface";
import { UserPermissionsService } from "./user-permissions.service";

@Resolver(() => CurrentUser)
@RequiredPermission(["userPermissions"], { skipScopeCheck: true })
export class CurrentUserResolver {
    constructor(private readonly userService: UserPermissionsService) {}

    @ResolveField(() => [GraphQLJSONObject])
    async allowedContentScopes(@Parent() user: CurrentUser): Promise<ContentScope[]> {
        const availableContentScopes = await this.userService.getAvailableContentScopes();
        if (!user.contentScopes) {
            return availableContentScopes;
        } else {
            return this.userService.normalizeContentScopes(
                [...user.contentScopes, ...user.permissions.flatMap((p) => p.contentScopes || [])],
                availableContentScopes,
            );
        }
    }
}
