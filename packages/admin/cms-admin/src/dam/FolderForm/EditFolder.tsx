import { useMutation, useQuery } from "@apollo/client";
import { FinalForm, type ISelectionApi, Loading } from "@comet/admin";

import { editFolderQuery, updateDamFolderMutation } from "./EditFolder.gql";
import {
    type GQLEditFolderQuery,
    type GQLEditFolderQueryVariables,
    type GQLUpdateDamFolderMutation,
    type GQLUpdateDamFolderMutationVariables,
} from "./EditFolder.gql.generated";
import { FolderFormFields, type FolderFormValues } from "./FolderFormFields";

interface EditFolderProps {
    id: string;
    selectionApi: ISelectionApi;
}

const EditFolder = ({ id, selectionApi }: EditFolderProps) => {
    const { loading, data } = useQuery<GQLEditFolderQuery, GQLEditFolderQueryVariables>(editFolderQuery, {
        variables: {
            id: id,
        },
    });

    const [updateDamFolder] = useMutation<GQLUpdateDamFolderMutation, GQLUpdateDamFolderMutationVariables>(updateDamFolderMutation);

    if (loading || !data?.damFolder) {
        return <Loading />;
    }

    return (
        <FinalForm<FolderFormValues>
            mode="edit"
            onSubmit={async ({ name }: FolderFormValues) => {
                await updateDamFolder({
                    variables: {
                        id: id,
                        input: {
                            name,
                        },
                    },
                });
            }}
            onAfterSubmit={() => {
                selectionApi.handleDeselect();
            }}
            initialValues={data?.damFolder}
        >
            <FolderFormFields />
        </FinalForm>
    );
};

export default EditFolder;
