import { useApolloClient } from "@apollo/client";
import { FetchResult } from "@apollo/client/link/core";

import {
    GQLDamFileTableFragment,
    GQLDamFolderTableFragment,
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

        const mutations: Array<Promise<FetchResult>> = [];

        if (fileIds.length > 0) {
            mutations.push(
                client.mutate<GQLMoveDamFilesMutation, GQLMoveDamFilesMutationVariables>({
                    mutation: moveDamFilesMutation,
                    variables: {
                        fileIds,
                        targetFolderId: dropTargetItem.id,
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
                }),
            );
        }

        await Promise.all(mutations);

        damMultiselectApi.unselectAll();
        await client.refetchQueries({ include: [namedOperations.Query.DamList] });
    };

    return { moveItem };
};
