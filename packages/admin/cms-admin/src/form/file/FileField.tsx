import { useApolloClient } from "@apollo/client";
import { Assets } from "@comet/admin-icons";
import { AdminComponentButton } from "@comet/blocks-admin";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { ChooseFileDialog } from "./chooseFile/ChooseFileDialog";
import { damFileFieldFileQuery } from "./FileField.gql";
import { GQLDamFileFieldFileFragment, GQLDamFileFieldFileQuery, GQLDamFileFieldFileQueryVariables } from "./FileField.gql.generated";
export { GQLDamFileFieldFileFragment } from "./FileField.gql.generated";

interface FileFieldProps extends FieldRenderProps<GQLDamFileFieldFileFragment, HTMLInputElement> {
    buttonText?: string;
    allowedMimetypes?: string[];
}

const FileField = ({ buttonText, input, allowedMimetypes }: FileFieldProps): React.ReactElement => {
    const [chooseFileDialogOpen, setChooseFileDialogOpen] = React.useState<boolean>(false);
    const client = useApolloClient();

    return (
        <>
            <AdminComponentButton onClick={() => setChooseFileDialogOpen(true)} startIcon={<Assets />} size="large">
                {buttonText ?? <FormattedMessage id="comet.form.file.chooseFile" defaultMessage="Choose file" />}
            </AdminComponentButton>
            <ChooseFileDialog
                open={chooseFileDialogOpen}
                allowedMimetypes={allowedMimetypes}
                onClose={() => setChooseFileDialogOpen(false)}
                onChooseFile={async (fileId) => {
                    setChooseFileDialogOpen(false);
                    const { data } = await client.query<GQLDamFileFieldFileQuery, GQLDamFileFieldFileQueryVariables>({
                        query: damFileFieldFileQuery,
                        variables: {
                            id: fileId,
                        },
                    });

                    input.onChange(data.damFile);
                }}
            />
        </>
    );
};

export { FileField };
