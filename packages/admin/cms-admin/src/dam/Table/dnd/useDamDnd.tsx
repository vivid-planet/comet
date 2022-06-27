import { useApolloClient } from "@apollo/client";
import { FetchResult } from "@apollo/client/link/core";

import {
    GQLDamFileTableFragment,
    GQLDamFolderTableFragment,
    GQLDamListQuery,
    GQLDamListQueryVariables,
    GQLMoveDamFilesMutation,
    GQLMoveDamFilesMutationVariables,
    GQLMoveDamFoldersMutation,
    GQLMoveDamFoldersMutationVariables,
    namedOperations,
} from "../../../graphql.generated";
import { isFile } from "../FolderTableRow";
import { DamMultiselectItem, useDamMultiselectApi } from "../multiselect/DamMultiselect";
import { moveDamFilesMutation, moveDamFoldersMutation } from "./useDamDnD.gql";

interface MoveItemParams {
    dragItem: GQLDamFileTableFragment | GQLDamFolderTableFragment;
    dropTargetItem: { id: string | null };
}

interface DamDnDApi {
    moveItem: (params: MoveItemParams) => Promise<void>;
}

export const useDamDnD = (): DamDnDApi => {
    const client = useApolloClient();
    const damMultiselectApi = useDamMultiselectApi();

    const moveItem = async ({ dropTargetItem, dragItem }: MoveItemParams) => {
        const itemsToUpdate: DamMultiselectItem[] = damMultiselectApi.isSelected(dragItem.id)
            ? damMultiselectApi.selectedItems
            : [
                  {
                      type: isFile(dragItem) ? "file" : "folder",
                      id: dragItem.id,
                  },
              ];

        // prevent moving a folder into itself
        if (itemsToUpdate.find((item) => item.id === dropTargetItem.id)) {
            return;
        }

        const fileIds = [];
        const folderIds = [];

        for (const item of itemsToUpdate) {
            if (item.type === "file") {
                fileIds.push(item.id);
            } else {
                folderIds.push(item.id);
            }
        }

        const queries = client.getObservableQueries();
        const damListQuery = Array.from(queries.values()).find((query) => query.queryName === namedOperations.Query.DamList);

        const mutations: Array<Promise<FetchResult>> = [];

        if (fileIds.length > 0) {
            mutations.push(
                client.mutate<GQLMoveDamFilesMutation, GQLMoveDamFilesMutationVariables>({
                    mutation: moveDamFilesMutation,
                    variables: {
                        fileIds,
                        targetFolderId: dropTargetItem.id,
                    },
                    optimisticResponse: ({ fileIds }) => {
                        return {
                            moveDamFiles: (fileIds as string[]).map((fileId) => {
                                return {
                                    id: fileId,
                                };
                            }),
                        };
                    },
                    update: (cache, result) => {
                        if (damListQuery) {
                            const movedFileIds = result.data?.moveDamFiles.map((file) => file.id) ?? [];

                            cache.updateQuery<GQLDamListQuery, GQLDamListQueryVariables>({ ...damListQuery.options }, (data) => {
                                const filteredFilesList = data?.damFilesList.filter((file) => !movedFileIds.includes(file.id));
                                return {
                                    damFoldersList: data?.damFoldersList ?? [],
                                    damFilesList: filteredFilesList ?? [],
                                };
                            });
                        }
                    },
                }),
            );
        }

        if (folderIds.length > 0) {
            mutations.push(
                client.mutate<GQLMoveDamFoldersMutation, GQLMoveDamFoldersMutationVariables>({
                    mutation: moveDamFoldersMutation,
                    variables: {
                        folderIds,
                        targetFolderId: dropTargetItem.id,
                    },
                    optimisticResponse: ({ folderIds, targetFolderId }) => {
                        return {
                            moveDamFolders: (folderIds as string[]).map((folderId) => {
                                return {
                                    id: folderId,
                                    // this is, of course, not the correct mpath,
                                    // but it would be complicated (and in some cases impossible) to generate it locally
                                    // since mpath is only needed for the breadcrumbs, it's sufficient to wait for the API response
                                    mpath: [],
                                };
                            }),
                        };
                    },
                    update: (cache, result) => {
                        if (damListQuery) {
                            const movedFolderIds = result.data?.moveDamFolders.map((folder) => folder.id) ?? [];

                            cache.updateQuery<GQLDamListQuery, GQLDamListQueryVariables>({ ...damListQuery.options }, (data) => {
                                const filteredFoldersList = data?.damFoldersList.filter((folder) => !movedFolderIds.includes(folder.id));
                                return {
                                    damFoldersList: filteredFoldersList ?? [],
                                    damFilesList: data?.damFilesList ?? [],
                                };
                            });
                        }
                    },
                }),
            );
        }

        await Promise.all(mutations);

        damMultiselectApi.unselectAll();
        await client.refetchQueries({ include: [namedOperations.Query.DamList] });
    };

    return { moveItem };
};
