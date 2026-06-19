import { gql, useApolloClient } from "@apollo/client";
import isEqual from "lodash.isequal";
import { useMemo } from "react";

import type { ReplaceDependencyObject } from "../../blocks/types";
import type { ScopeCopyHandler } from "../../dependencies/scopeCopy/ScopeCopyHandler";
import type { GQLImageCropAreaInput } from "../../graphql.generated";
import { useDamScope } from "../config/useDamScope";
import { createInboxFolder } from "./createInboxFolder";
import type {
    GQLCopyFilesToScopeMutation,
    GQLCopyFilesToScopeMutationVariables,
    GQLFindCopiesOfFileInScopeQuery,
    GQLFindCopiesOfFileInScopeQueryVariables,
} from "./useDamFileScopeCopyHandler.generated";

const DAM_FILE_DEPENDENCY_TYPE = "DamFile";

interface DamFileDependencyData {
    damFile: {
        id: string;
        scope?: Record<string, unknown>;
        image?: { cropArea?: GQLImageCropAreaInput | null } | null;
    };
}

const findCopiesOfFileInScopeQuery = gql`
    query FindCopiesOfFileInScope($id: ID!, $scope: DamScopeInput!, $imageCropArea: ImageCropAreaInput) {
        findCopiesOfFileInScope(id: $id, scope: $scope, imageCropArea: $imageCropArea) {
            id
        }
    }
`;

const copyFilesToScopeMutation = gql`
    mutation CopyFilesToScope($fileIds: [ID!]!, $inboxFolderId: ID!) {
        copyFilesToScope(fileIds: $fileIds, inboxFolderId: $inboxFolderId) {
            mappedFiles {
                rootFile {
                    id
                }
                copy {
                    id
                }
            }
        }
    }
`;

/**
 * Built-in {@link ScopeCopyHandler} for DAM files. On a scope-crossing copy it reuses an existing
 * copy in the target DAM scope when one exists, otherwise copies the files into a DAM inbox folder
 * in the target scope. Files that already live in the target DAM scope (or when the DAM is unscoped)
 * are kept as-is.
 */
export function useDamFileScopeCopyHandler(): ScopeCopyHandler<DamFileDependencyData> {
    const targetDamScope = useDamScope();
    const client = useApolloClient();

    return useMemo<ScopeCopyHandler<DamFileDependencyData>>(() => {
        const hasDamScope = Object.entries(targetDamScope).length > 0;

        return {
            dependencyType: DAM_FILE_DEPENDENCY_TYPE,
            copyToScope: async (dependencies) => {
                const replacements: ReplaceDependencyObject[] = [];

                if (!hasDamScope) {
                    // DAM is global/unscoped: references stay valid in any scope, keep them as-is.
                    return replacements;
                }

                const filesToCopy: Array<{ id: string; scope?: Record<string, unknown> }> = [];

                for (const { data } of dependencies) {
                    const damFile = data.damFile;

                    if (isEqual(damFile.scope, targetDamScope)) {
                        // already in the target scope, no need to copy
                        continue;
                    }

                    const { data: existingCopies } = await client.query<GQLFindCopiesOfFileInScopeQuery, GQLFindCopiesOfFileInScopeQueryVariables>({
                        query: findCopiesOfFileInScopeQuery,
                        variables: {
                            id: damFile.id,
                            scope: targetDamScope,
                            imageCropArea: damFile.image?.cropArea,
                        },
                    });

                    if (existingCopies.findCopiesOfFileInScope.length > 0) {
                        replacements.push({
                            type: DAM_FILE_DEPENDENCY_TYPE,
                            originalId: damFile.id,
                            replaceWithId: existingCopies.findCopiesOfFileInScope[0].id,
                        });
                    } else {
                        filesToCopy.push({ id: damFile.id, scope: damFile.scope });
                    }
                }

                if (filesToCopy.length > 0) {
                    const sourceScopes: Record<string, unknown>[] = [];
                    for (const file of filesToCopy) {
                        if (file.scope && !sourceScopes.some((scope) => isEqual(scope, file.scope))) {
                            sourceScopes.push(file.scope);
                        }
                    }

                    const inboxFolder = await createInboxFolder({ client, targetScope: targetDamScope, sourceScopes });

                    const { data: copiedFiles } = await client.mutate<GQLCopyFilesToScopeMutation, GQLCopyFilesToScopeMutationVariables>({
                        mutation: copyFilesToScopeMutation,
                        variables: { fileIds: filesToCopy.map((file) => file.id), inboxFolderId: inboxFolder.id },
                        update: (cache) => {
                            cache.evict({ fieldName: "damItemsList" });
                        },
                    });

                    if (copiedFiles) {
                        for (const item of copiedFiles.copyFilesToScope.mappedFiles) {
                            replacements.push({ type: DAM_FILE_DEPENDENCY_TYPE, originalId: item.rootFile.id, replaceWithId: item.copy.id });
                        }
                    }
                }

                return replacements;
            },
        };
    }, [client, targetDamScope]);
}
