import { useApolloClient } from "@apollo/client";
import { Alert, useSnackbarApi } from "@comet/admin";
import { Assets, Delete, MoreVertical } from "@comet/admin-icons";
import { Box, Divider, Grid, IconButton, List, Snackbar, Typography } from "@mui/material";
import { type ReactElement, type ReactNode, useState } from "react";
import type { FieldRenderProps } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { BlockAdminComponentButton } from "../../blocks/common/BlockAdminComponentButton";
import { BlockAdminComponentPaper } from "../../blocks/common/BlockAdminComponentPaper";
import { ChooseDamFileDialog } from "./chooseFile/ChooseDamFileDialog";
import { ChooseDamFilesDialog } from "./chooseFile/ChooseDamFilesDialog";
import { DamPathLazy } from "./DamPathLazy";
import { damFileFieldFileQuery, damMultiFileFieldFileQuery } from "./FileField.gql";
import type {
    GQLDamFileFieldFileFragment,
    GQLDamFileFieldFileQuery,
    GQLDamFileFieldFileQueryVariables,
    GQLDamMultiFileFieldFileFragment,
    GQLDamMultiFileFieldFileQuery,
    GQLDamMultiFileFieldFileQueryVariables,
} from "./FileField.gql.generated";
import { type ActionItem, FileFieldMenu, useHasFileFieldMenu } from "./FileFieldMenu";
import { FileFieldRow } from "./FileFieldRow";

export type { GQLDamFileFieldFileFragment, GQLDamMultiFileFieldFileFragment } from "./FileField.gql.generated";

type CommonProps = {
    buttonText?: ReactNode;
    allowedMimetypes?: string[];
    menuActions?: Array<ActionItem | ReactElement | null | undefined>;
};

type SingleFileFieldProps = FieldRenderProps<GQLDamFileFieldFileFragment | undefined, HTMLInputElement> &
    CommonProps & {
        multiple?: false;
        preview?: ReactNode;
    };

type MultiFileFieldProps = FieldRenderProps<GQLDamMultiFileFieldFileFragment[] | undefined, HTMLInputElement> &
    CommonProps & {
        multiple: true;
        preview?: (file: GQLDamMultiFileFieldFileFragment) => ReactNode;
    };

export function FileField(props: SingleFileFieldProps): ReactElement;
export function FileField(props: MultiFileFieldProps): ReactElement;
export function FileField(props: SingleFileFieldProps | MultiFileFieldProps): ReactElement {
    // `react-final-form`'s `<Field>` strips `multiple` from the component's top-level props
    // and puts it on `input.multiple`, so we have to check both locations.
    const isMultiple = Boolean(props.multiple) || Boolean(props.input?.multiple);
    if (isMultiple) {
        return <MultiFileField {...(props as MultiFileFieldProps)} />;
    }
    return <SingleFileField {...(props as SingleFileFieldProps)} />;
}

const SingleFileField = ({ buttonText, input, allowedMimetypes, preview, menuActions }: SingleFileFieldProps) => {
    const [chooseFileDialogOpen, setChooseFileDialogOpen] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const apolloClient = useApolloClient();
    const showMenu = useHasFileFieldMenu(menuActions);

    const damFile = input.value;

    if (damFile) {
        return (
            <>
                <BlockAdminComponentPaper disablePadding>
                    <Box padding={3}>
                        <Grid container alignItems="center" spacing={3}>
                            {preview && <Grid>{preview}</Grid>}
                            <Grid size="grow">
                                <Typography variant="subtitle1">{damFile.name}</Typography>
                                <Typography variant="body1" color="textSecondary">
                                    <DamPathLazy fileId={damFile.id} />
                                </Typography>
                            </Grid>
                            {showMenu && (
                                <Grid>
                                    <IconButton
                                        onMouseDown={(event) => event.stopPropagation()}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setAnchorEl(event.currentTarget);
                                        }}
                                        size="large"
                                    >
                                        <MoreVertical />
                                    </IconButton>
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                    <Divider />
                    <BlockAdminComponentButton startIcon={<Delete />} onClick={() => input.onChange(undefined)}>
                        <FormattedMessage id="comet.form.file.empty" defaultMessage="Empty" />
                    </BlockAdminComponentButton>
                </BlockAdminComponentPaper>
                {showMenu && (
                    <FileFieldMenu fileId={damFile.id} anchorEl={anchorEl} onClose={() => setAnchorEl(null)} menuActions={menuActions} keepMounted />
                )}
            </>
        );
    }

    return (
        <>
            <BlockAdminComponentButton onClick={() => setChooseFileDialogOpen(true)} startIcon={<Assets />} size="large">
                {buttonText ?? <FormattedMessage id="comet.form.file.chooseFile" defaultMessage="Choose file" />}
            </BlockAdminComponentButton>
            <ChooseDamFileDialog
                open={chooseFileDialogOpen}
                allowedMimetypes={allowedMimetypes}
                onClose={() => setChooseFileDialogOpen(false)}
                onChooseFile={async (fileId) => {
                    setChooseFileDialogOpen(false);
                    const { data } = await apolloClient.query<GQLDamFileFieldFileQuery, GQLDamFileFieldFileQueryVariables>({
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

const MultiFileField = ({ buttonText, input, allowedMimetypes, preview, menuActions }: MultiFileFieldProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const apolloClient = useApolloClient();
    const snackbarApi = useSnackbarApi();

    // react-final-form may pass "" as the default when no initial value is set; fall back to [].
    const files: GQLDamMultiFileFieldFileFragment[] = Array.isArray(input.value) ? input.value : [];

    const handleRemove = (id: string) => {
        input.onChange(files.filter((f) => f.id !== id));
    };

    const handleConfirm = async (fileIds: string[]) => {
        try {
            const next = await Promise.all(
                fileIds.map(async (id) => {
                    const { data } = await apolloClient.query<GQLDamMultiFileFieldFileQuery, GQLDamMultiFileFieldFileQueryVariables>({
                        query: damMultiFileFieldFileQuery,
                        variables: { id },
                    });
                    return data.damFile;
                }),
            );

            input.onChange(next);
            setDialogOpen(false);
        } catch {
            snackbarApi.showSnackbar(
                <Snackbar autoHideDuration={5000}>
                    <Alert severity="error">
                        <FormattedMessage
                            id="comet.form.file.failedToLoadSelection"
                            defaultMessage="Failed to load selected files. Please try again."
                        />
                    </Alert>
                </Snackbar>,
            );
        }
    };

    return (
        <>
            {files.length === 0 ? (
                <BlockAdminComponentButton onClick={() => setDialogOpen(true)} startIcon={<Assets />} size="large">
                    {buttonText ?? <FormattedMessage id="comet.form.file.chooseFiles" defaultMessage="Choose files" />}
                </BlockAdminComponentButton>
            ) : (
                <BlockAdminComponentPaper disablePadding>
                    <List disablePadding>
                        {files.map((file) => (
                            <FileFieldRow
                                key={file.id}
                                file={file}
                                onRemove={() => handleRemove(file.id)}
                                preview={preview}
                                menuActions={menuActions}
                            />
                        ))}
                    </List>
                    <Divider />
                    <BlockAdminComponentButton startIcon={<Assets />} onClick={() => setDialogOpen(true)}>
                        <FormattedMessage id="comet.form.file.changeSelectedFiles" defaultMessage="Change selected files" />
                    </BlockAdminComponentButton>
                </BlockAdminComponentPaper>
            )}
            {dialogOpen && (
                <ChooseDamFilesDialog
                    allowedMimetypes={allowedMimetypes}
                    initialFileIds={files.map((f) => f.id)}
                    onClose={() => setDialogOpen(false)}
                    onConfirm={handleConfirm}
                />
            )}
        </>
    );
};
