import { AbstractAccessControlService, ContentScopesForUser, PermissionsForUser, User, UserPermissions } from "@comet/cms-api";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AccessControlService extends AbstractAccessControlService {
    getPermissionsForUser(user: User): PermissionsForUser {
        if (user.email.endsWith("@comet-dxp.com")) {
            return UserPermissions.allPermissions;
        } else {
            return [
                {
                    permission: "products",
                },
                {
                    permission: {
                        permission: "news",
                        configuration: {
                            commentsEdit: false, // Deny user to access news-comment.resolver.ts
                        },
                    },
                    contentScopes: [{ domain: "secondary", language: "en" }],
                },
            ];
        }
    }
    getContentScopesForUser(user: User): ContentScopesForUser {
        if (user.email.endsWith("@comet-dxp.com")) {
            return UserPermissions.allContentScopes;
        } else {
            return [{ domain: "main", language: "en" }];
        }
    }
}
