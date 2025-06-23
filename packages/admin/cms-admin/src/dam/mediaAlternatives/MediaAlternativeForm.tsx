import { gql, useMutation, useQuery } from "@apollo/client";
import { Field, FinalForm, FinalFormInput, ISelectionApi, Loading } from "@comet/admin";
import { FormattedMessage } from "react-intl";

import { FileField } from "../../form/file/FileField";
import { useDamAcceptedMimeTypes } from "../config/useDamAcceptedMimeTypes";
import {
    GQLCreateDamMediaAlternativeMutation,
    GQLCreateDamMediaAlternativeMutationVariables,
    GQLEditMediaAlternativeQuery,
    GQLEditMediaAlternativeQueryVariables,
    GQLUpdateDamMediaAlternativeMutation,
    GQLUpdateDamMediaAlternativeMutationVariables,
} from "./MediaAlternativeForm.generated";

interface MediaAlternativeFormProps {
    mode: "add" | "edit";
    selectionApi: ISelectionApi;
    fileId: string;
    id?: string;
}

interface FormValues {
    alternative: { id: string; name: string; damPath: string };
    language: string;
}

export const MediaAlternativeForm = ({ mode, selectionApi, fileId, id }: MediaAlternativeFormProps) => {
    const acceptedMimeTypes = useDamAcceptedMimeTypes();

    const [createDamMediaAlternative] = useMutation<GQLCreateDamMediaAlternativeMutation, GQLCreateDamMediaAlternativeMutationVariables>(
        createDamMediaAlternativeMutation,
        {
            refetchQueries: ["DamMediaAlternatives"],
        },
    );
    const [updateDamMediaAlternative] = useMutation<GQLUpdateDamMediaAlternativeMutation, GQLUpdateDamMediaAlternativeMutationVariables>(
        updateDamMediaAlternativeMutation,
        {
            refetchQueries: ["DamMediaAlternatives"],
        },
    );

    const { data, loading } = useQuery<GQLEditMediaAlternativeQuery, GQLEditMediaAlternativeQueryVariables>(editMediaAlternativeQuery, {
        variables: { id: id ?? "" },
        skip: mode === "add",
    });

    if (mode === "edit" && (loading || !data?.damMediaAlternative)) {
        return <Loading />;
    }

    const initialValues =
        mode === "edit" && data ? { language: data.damMediaAlternative.language, alternative: data.damMediaAlternative.alternative } : undefined;

    return (
        <FinalForm<FormValues>
            mode={mode}
            onSubmit={async ({ alternative, language }) => {
                if (mode === "add") {
                    await createDamMediaAlternative({
                        variables: {
                            input: {
                                alternative: alternative.id,
                                for: fileId,
                                language,
                                type: "captions",
                            },
                        },
                    });
                } else {
                    if (id === undefined) {
                        throw new Error("id is required for update mode");
                    }
                    await updateDamMediaAlternative({
                        variables: {
                            id,
                            input: {
                                language,
                                alternative: alternative.id,
                            },
                        },
                    });
                }
            }}
            onAfterSubmit={() => selectionApi.handleDeselect()}
            initialValues={initialValues}
        >
            <Field
                name="alternative"
                component={FileField}
                allowedMimetypes={acceptedMimeTypes.filteredAcceptedMimeTypes.captions}
                fullWidth
                required
            />
            <Field
                label={<FormattedMessage id="comet.dam.mediaAlternativeForm.language.label" defaultMessage="Language" />}
                name="language"
                helperText={
                    <FormattedMessage
                        id="comet.dam.mediaAlternativeForm.language.helperText"
                        defaultMessage="Please enter the language as a language code (e.g., en, de, it, ...)."
                    />
                }
                component={FinalFormInput}
                fullWidth
                required
            />
        </FinalForm>
    );
};

const updateDamMediaAlternativeMutation = gql`
    mutation UpdateDamMediaAlternative($id: ID!, $input: DamMediaAlternativeUpdateInput!) {
        updateDamMediaAlternative(id: $id, input: $input) {
            id
        }
    }
`;

const editMediaAlternativeQuery = gql`
    query EditMediaAlternative($id: ID!) {
        damMediaAlternative(id: $id) {
            id
            language
            alternative {
                id
                name
                damPath
            }
        }
    }
`;

const createDamMediaAlternativeMutation = gql`
    mutation CreateDamMediaAlternative($input: DamMediaAlternativeInput!) {
        createDamMediaAlternative(input: $input) {
            id
        }
    }
`;
