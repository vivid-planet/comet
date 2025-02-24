import { useMutation } from "@apollo/client";
import { FinalForm, type ISelectionApi } from "@comet/admin";

import { useDamScope } from "../config/useDamScope";
import { clearDamItemCache } from "../helpers/clearDamItemCache";
import { createDamFolderMutation } from "./AddFolder.gql";
import { type GQLCreateDamFolderMutation, type GQLCreateDamFolderMutationVariables } from "./AddFolder.gql.generated";
import { FolderFormFields, type FolderFormValues } from "./FolderFormFields";

interface AddFolderProps {
    parentId?: string;
    selectionApi: ISelectionApi;
}

const AddFolder = ({ parentId, selectionApi }: AddFolderProps) => {
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
