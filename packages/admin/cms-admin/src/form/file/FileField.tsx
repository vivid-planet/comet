import { useApolloClient } from "@apollo/client";
import { Assets } from "@comet/admin-icons";
import { useState } from "react";
import { type FieldRenderProps } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { BlockAdminComponentButton } from "../../blocks/common/BlockAdminComponentButton";
import { ChooseFileDialog } from "./chooseFile/ChooseFileDialog";
import { damFileFieldFileQuery } from "./FileField.gql";
import { type GQLDamFileFieldFileFragment, type GQLDamFileFieldFileQuery, type GQLDamFileFieldFileQueryVariables } from "./FileField.gql.generated";

export { GQLDamFileFieldFileFragment } from "./FileField.gql.generated";

interface FileFieldProps extends FieldRenderProps<GQLDamFileFieldFileFragment, HTMLInputElement> {
    buttonText?: string;
    allowedMimetypes?: string[];
}

const FileField = ({ buttonText, input, allowedMimetypes }: FileFieldProps) => {
    const [chooseFileDialogOpen, setChooseFileDialogOpen] = useState<boolean>(false);
    const client = useApolloClient();

    return (
        <>
            <BlockAdminComponentButton onClick={() => setChooseFileDialogOpen(true)} startIcon={<Assets />} size="large">
                {buttonText ?? <FormattedMessage id="comet.form.file.chooseFile" defaultMessage="Choose file" />}
            </BlockAdminComponentButton>
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
