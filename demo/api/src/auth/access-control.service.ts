import { AbstractAccessControlService, ContentScopesForUser, PermissionsForUser, User } from "@comet/cms-api";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AccessControlService extends AbstractAccessControlService {
    getPermissionsForUser(user: User): PermissionsForUser {
        return [{ permission: "products" }, { permission: "news", contentScopes: [{ domain: "secondary", language: "en" }] }];
    }
    getContentScopesForUser(user: User): ContentScopesForUser {
        return [{ domain: "main", language: "en" }];
    }
}
