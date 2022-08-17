import { gql, useApolloClient } from "@apollo/client";
import { CancelButton, Field, FinalForm, FinalFormInput } from "@comet/admin";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { GQLDamFilenameAlreadyExistsQuery, GQLDamFilenameAlreadyExistsQueryVariables } from "../../../graphql.generated";

const damFilenameAlreadyExistsQuery = gql`
    query DamFilenameAlreadyExists($filename: String!, $folderId: String) {
        damFilenameAlreadyExists(filename: $filename, folderId: $folderId)
    }
`;

interface FormValues {
    newFilename: string;
}

interface DuplicateFilenameDialogProps {
    open: boolean;
    currentFilename?: string;
    extension?: string;
    folderId: string | null;
    suggestedFilename?: string;
    onCancel: () => void;
    onRename: (newFilename: string) => void;
}

export const DuplicatedFilenameDialog: React.VoidFunctionComponent<DuplicateFilenameDialogProps> = ({
    open,
    currentFilename,
    extension,
    folderId,
    suggestedFilename,
    onCancel,
    onRename,
}) => {
    const client = useApolloClient();
    const intl = useIntl();

    const validateFilenameAlreadyExists = React.useCallback(
        async (filename: string): Promise<boolean> => {
            const { data } = await client.query<GQLDamFilenameAlreadyExistsQuery, GQLDamFilenameAlreadyExistsQueryVariables>({
                query: damFilenameAlreadyExistsQuery,
                variables: {
                    filename,
                    folderId,
                },
                fetchPolicy: "network-only",
            });

            return data.damFilenameAlreadyExists;
        },
        [client, folderId],
    );

    return (
        <Dialog open={open}>
            <DialogTitle>
                <FormattedMessage id="comet.dam.duplicateFilenameDialog.title" defaultMessage="Duplicate filename" />
            </DialogTitle>
            <FinalForm<FormValues>
                mode="add"
                onSubmit={(values) => {
                    const newFilename = values.newFilename;
                    const newFilenameWithExtension = extension && !newFilename.endsWith(extension) ? `${newFilename}${extension}` : newFilename;

                    onRename(newFilenameWithExtension);
                }}
                initialValues={{ newFilename: suggestedFilename }}
                allowPristineSubmission
            >
                <DialogContent>
                    <Typography style={{ paddingBottom: "16px" }} variant="body1">
                        <FormattedMessage
                            id="comet.dam.duplicateFilenameDialog.heading"
                            defaultMessage="A file with the name {filename} already exists. Do you want to rename it?"
                            values={{
                                filename: currentFilename,
                            }}
                        />
                    </Typography>
                    <Field
                        component={FinalFormInput}
                        name="newFilename"
                        label={<FormattedMessage id="comet.dam.duplicateFilenameDialog.form.label" defaultMessage="New filename" />}
                        validate={async (value: string) => {
                            if (value) {
                                if (await validateFilenameAlreadyExists(value)) {
                                    return intl.formatMessage({
                                        id: "comet.dam.duplicateFilenameDialog.form.validationError.filenameAlreadyExists",
                                        defaultMessage: "Filename already exists",
                                    });
                                }
                            }
                        }}
                        fullWidth
                        autoFocus
                    />
                </DialogContent>
                <DialogActions>
                    <CancelButton onClick={onCancel} />
                    <Button type="submit" variant="contained" color="primary">
                        <FormattedMessage id="comet.generic.rename" defaultMessage="Rename" />
                    </Button>
                </DialogActions>
            </FinalForm>
        </Dialog>
    );
};
