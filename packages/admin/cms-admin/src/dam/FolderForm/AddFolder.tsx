import { useMutation } from "@apollo/client";
import { FinalForm, ISelectionApi } from "@comet/admin";
import React from "react";

import { useDamScope } from "../config/useDamScope";
import { clearDamItemCache } from "../helpers/clearDamItemCache";
import { createDamFolderMutation } from "./AddFolder.gql";
import { GQLCreateDamFolderMutation, GQLCreateDamFolderMutationVariables } from "./AddFolder.gql.generated";
import { FolderFormFields, FolderFormValues } from "./FolderFormFields";

interface AddFolderProps {
    parentId?: string;
    selectionApi: ISelectionApi;
}

const AddFolder = ({ parentId, selectionApi }: AddFolderProps): React.ReactElement => {
    const scope = useDamScope();
    const [createDamFolder] = useMutation<GQLCreateDamFolderMutation, GQLCreateDamFolderMutationVariables>(createDamFolderMutation, {
        refetchQueries: ["DamItemsList"],
        update: (cache) => {
            clearDamItemCache(cache);
        },
    });

    return (
        <FinalForm<FolderFormValues>
            mode="add"
            onSubmit={async ({ name }: FolderFormValues) => {
                await createDamFolder({
                    variables: {
                        input: {
                            name,
                            parentId: parentId,
                        },
                        scope,
                    },
                });
            }}
            onAfterSubmit={() => {
                selectionApi.handleDeselect();
            }}
        >
            <FolderFormFields />
        </FinalForm>
    );
};

export default AddFolder;
