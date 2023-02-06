import { ObservableQuery, useApolloClient } from "@apollo/client";
import { FetchResult } from "@apollo/client/link/core";

import {
    GQLDamFileTableFragment,
    GQLDamFolderTableFragment,
    GQLDamItemsListQuery,
    GQLDamItemsListQueryVariables,
    GQLMoveDamFilesMutation,
    GQLMoveDamFilesMutationVariables,
    GQLMoveDamFoldersMutation,
    GQLMoveDamFoldersMutationVariables,
    namedOperations,
} from "../../../graphql.generated";
import { isFile, isFolder } from "../FolderTableRow";
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
        const damItemsListQuery = Array.from(queries.values()).find((query) => query.queryName === namedOperations.Query.DamItemsList) as
            | ObservableQuery<GQLDamItemsListQuery, GQLDamItemsListQueryVariables>
            | undefined;

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
                        if (damItemsListQuery) {
                            const movedFileIds = result.data?.moveDamFiles.map((file) => file.id) ?? [];

                            cache.updateQuery<GQLDamItemsListQuery, GQLDamItemsListQueryVariables>({ ...damItemsListQuery.options }, (data) => {
                                const filteredItemsList = data?.damItemsList.nodes.filter(
                                    (item) => isFolder(item) || !movedFileIds.includes(item.id),
                                );

                                const newTotalCount = data?.damItemsList.totalCount ? data?.damItemsList.totalCount - movedFileIds.length : 0;

                                return {
                                    damItemsList: {
                                        nodes: filteredItemsList ?? [],
                                        totalCount: newTotalCount,
                                    },
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
                        if (damItemsListQuery) {
                            const movedFolderIds = result.data?.moveDamFolders.map((folder) => folder.id) ?? [];

                            cache.updateQuery<GQLDamItemsListQuery, GQLDamItemsListQueryVariables>({ ...damItemsListQuery.options }, (data) => {
                                const filteredItemsList = data?.damItemsList?.nodes.filter(
                                    (item) => isFile(item) || !movedFolderIds.includes(item.id),
                                );

                                const newTotalCount = data?.damItemsList.totalCount ? data?.damItemsList.totalCount - movedFolderIds.length : 0;

                                return {
                                    damItemsList: {
                                        nodes: filteredItemsList ?? [],
                                        totalCount: newTotalCount,
                                    },
                                };
                            });
                        }
                    },
                }),
            );
        }

        await Promise.all(mutations);

        damMultiselectApi.unselectAll();
        await client.refetchQueries({ include: [namedOperations.Query.DamItemsList] });
    };

    return { moveItem };
};
