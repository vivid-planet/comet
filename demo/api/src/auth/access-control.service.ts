import { AccessControlServiceInterface, ContentScope, CurrentUserInterface } from "@comet/cms-api";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AccessControlService implements AccessControlServiceInterface {
    canAccessScope(requestScope: ContentScope, user: CurrentUserInterface): boolean {
        if (!user.domains) return true; //all domains
        return user.domains.includes(requestScope.domain);
    }
}
