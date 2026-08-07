import { Injectable, Scope } from "@nestjs/common";
import DataLoader from "dataloader";

import { ContentScopeSummaryByDimension } from "./dto/content-scope";
import { ContentScope } from "./interfaces/content-scope.interface";
import { User } from "./interfaces/user";
import { UserPermissionsService } from "./user-permissions.service";

// Summarizes a user's content scopes per dimension for the users list: the number of distinct values, or the wildcard
// "*" if the user has access to any value.
export function summarizeContentScopesByDimension(contentScopes: ContentScope[]): ContentScopeSummaryByDimension[] {
    const summaries = new Map<string, { values: Set<string>; allValues: boolean }>();
    for (const contentScope of contentScopes) {
        for (const [dimension, value] of Object.entries(contentScope)) {
            const summary = summaries.get(dimension) ?? { values: new Set<string>(), allValues: false };
            if (value === "*") {
                summary.allValues = true;
            } else {
                summary.values.add(String(value));
            }
            summaries.set(dimension, summary);
        }
    }
    return [...summaries].map(([dimension, { values, allValues }]) => ({ dimension, count: allValues ? "*" : values.size }));
}

@Injectable({ scope: Scope.REQUEST })
export class UserContentScopesLoaderService {
    private dataLoader: DataLoader<User, ContentScopeSummaryByDimension[], string>;

    constructor(private readonly userPermissionsService: UserPermissionsService) {
        this.dataLoader = new DataLoader<User, ContentScopeSummaryByDimension[], string>(
            async (users) => {
                // Compute the (shared) available content scopes only once for all batched users.
                const availableContentScopes = (await this.userPermissionsService.getAvailableContentScopes()).map((cs) => cs.scope);
                return Promise.all(
                    users.map(async (user) =>
                        summarizeContentScopesByDimension(
                            await this.userPermissionsService.filterContentScopesForUser({
                                user,
                                availableContentScopes,
                                includeContentScopesManual: true,
                            }),
                        ),
                    ),
                );
            },
            { cacheKeyFn: (user) => user.id },
        );
    }

    load(user: User): Promise<ContentScopeSummaryByDimension[]> {
        return this.dataLoader.load(user);
    }
}
