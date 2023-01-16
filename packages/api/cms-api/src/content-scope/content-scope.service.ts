import { Inject, Injectable } from "@nestjs/common";

import { CurrentUserInterface } from "../auth/current-user/current-user";
import { ContentScope } from "../common/decorators/content-scope.interface";
import { CAN_ACCESS_SCOPE } from "./conent-scope.constants";
import { CanAccessScope } from "./content-scope.module";

@Injectable()
export class ContentScopeService {
    constructor(@Inject(CAN_ACCESS_SCOPE) private canAccessScopeConfig: CanAccessScope) {}

    canAccessScope(requestScope: ContentScope, user: CurrentUserInterface): boolean {
        return this.canAccessScopeConfig(requestScope, user);
    }
}
