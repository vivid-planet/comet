import { useApolloClient } from "@apollo/client";
import { Alert, useSnackbarApi } from "@comet/admin";
import { Assets, Delete, MoreVertical, OpenNewTab } from "@comet/admin-icons";
import { Box, Divider, Grid, IconButton, List, ListItemIcon, ListItemText, Menu, MenuItem, Snackbar, Typography } from "@mui/material";
import { type ComponentProps, isValidElement, type ReactElement, type ReactNode, useRef, useState } from "react";
import type { FieldRenderProps } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { BlockAdminComponentButton } from "../../blocks/common/BlockAdminComponentButton";
import { BlockAdminComponentPaper } from "../../blocks/common/BlockAdminComponentPaper";
import { useContentScope } from "../../contentScope/Provider";
import { useDependenciesConfig } from "../../dependencies/dependenciesConfig";
import { ChooseFileDialog } from "./chooseFile/ChooseFileDialog";
import { ChooseFilesDialog } from "./chooseFile/ChooseFilesDialog";
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
import { FileFieldRow } from "./FileFieldRow";

export type { GQLDamFileFieldFileFragment, GQLDamMultiFileFieldFileFragment } from "./FileField.gql.generated";

interface ActionItem extends ComponentProps<typeof MenuItem> {
    label: ReactNode;
    icon?: ReactNode;
}

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
    // and puts it on `input.multiple` (same pattern as `FinalFormFileUpload`), so we need to
    // check both locations — `input.multiple` when used via `<Field>`, `props.multiple` when
    // `FileField` is rendered directly (e.g. in unit tests).
    const isMultiple = Boolean(props.multiple) || Boolean(props.input?.multiple);
    if (isMultiple) {
        return <MultiFileField {...(props as MultiFileFieldProps)} />;
    }
    return <SingleFileField {...(props as SingleFileFieldProps)} />;
}

const SingleFileField = ({ buttonText, input, allowedMimetypes, preview, menuActions }: SingleFileFieldProps) => {
    const [chooseFileDialogOpen, setChooseFileDialogOpen] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const contentScope = useContentScope();
    const apolloClient = useApolloClient();
    const { entityDependencyMap } = useDependenciesConfig();

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const damFile = input.value;

    if (damFile) {
        const showMenu = Boolean(entityDependencyMap["DamFile"]) || (menuActions !== undefined && menuActions.length > 0);
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
                    <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        {entityDependencyMap["DamFile"] && (
                            <MenuItem
                                onClick={async () => {
                                    const path = await entityDependencyMap["DamFile"].resolvePath({
                                        apolloClient,
                                        id: damFile.id,
                                    });
                                    const url = contentScope.match.url + path;
                                    window.open(url, "_blank");
                                }}
                            >
                                <ListItemIcon>
                                    <OpenNewTab />
                                </ListItemIcon>
                                <ListItemText primary={<FormattedMessage id="comet.form.file.openInDam" defaultMessage="Open in DAM" />} />
                            </MenuItem>
                        )}
                        {menuActions &&
                            menuActions.map((item, index) => {
                                if (!item) {
                                    return null;
                                }

                                if (isValidElement(item)) {
                                    return item;
                                }

                                const { label, icon, ...rest } = item as ActionItem;

                                return (
                                    <MenuItem key={index} {...rest}>
                                        {!!icon && <ListItemIcon>{icon}</ListItemIcon>}
                                        <ListItemText primary={label} />
                                    </MenuItem>
                                );
                            })}
                    </Menu>
                )}
            </>
        );
    }

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

export const MultiFileField = ({ buttonText, input, allowedMimetypes, preview, menuActions }: MultiFileFieldProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const apolloClient = useApolloClient();
    const snackbarApi = useSnackbarApi();

    // react-final-form can pass "" as the default when no initial value is set, so normalize to an array.
    const files: GQLDamMultiFileFieldFileFragment[] = Array.isArray(input.value) ? input.value : [];

    // react-dnd fires several `hover` events per task during a fast drag — faster than React can
    // commit re-renders. Without a synchronously-updated ref, back-to-back hovers all read the
    // same stale `files` snapshot and clobber each other's reorder, producing unrelated swaps.
    // The pattern mirrors `createBlocksBlock`'s functional `updateState((prev) => …)` updater.
    const filesRef = useRef(files);
    filesRef.current = files;

    const commitChange = (next: GQLDamMultiFileFieldFileFragment[]) => {
        filesRef.current = next;
        input.onChange(next.length === 0 ? undefined : next);
    };

    const handleRemove = (id: string) => {
        commitChange(filesRef.current.filter((f) => f.id !== id));
    };

    const handleMove = (dragIndex: number, hoverIndex: number) => {
        const next = [...filesRef.current];
        const [moved] = next.splice(dragIndex, 1);
        next.splice(hoverIndex, 0, moved);
        commitChange(next);
    };

    const handleConfirm = async (fileIds: string[]) => {
        // Don't close the dialog yet — if a query rejects we want to keep the user's selection
        // visible and surface the error rather than silently dropping their work.
        const existingById = new Map<string, GQLDamMultiFileFieldFileFragment>(files.map((f) => [f.id, f]));
        try {
            const next: GQLDamMultiFileFieldFileFragment[] = await Promise.all(
                fileIds.map(async (id) => {
                    const existing = existingById.get(id);
                    if (existing) {
                        return existing;
                    }
                    const { data } = await apolloClient.query<GQLDamMultiFileFieldFileQuery, GQLDamMultiFileFieldFileQueryVariables>({
                        query: damMultiFileFieldFileQuery,
                        variables: { id },
                    });
                    return data.damFile as GQLDamMultiFileFieldFileFragment;
                }),
            );

            commitChange(next);
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

    if (files.length === 0) {
        return (
            <>
                <BlockAdminComponentButton onClick={() => setDialogOpen(true)} startIcon={<Assets />} size="large">
                    {buttonText ?? <FormattedMessage id="comet.form.file.chooseFiles" defaultMessage="Choose files" />}
                </BlockAdminComponentButton>
                <ChooseFilesDialog
                    open={dialogOpen}
                    allowedMimetypes={allowedMimetypes}
                    initialFileIds={[]}
                    onClose={() => setDialogOpen(false)}
                    onConfirm={handleConfirm}
                />
            </>
        );
    }

    return (
        <>
            <BlockAdminComponentPaper disablePadding>
                <List disablePadding>
                    {files.map((file, index) => (
                        <FileFieldRow
                            key={file.id}
                            file={file}
                            index={index}
                            onRemove={() => handleRemove(file.id)}
                            onMove={handleMove}
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
            <ChooseFilesDialog
                open={dialogOpen}
                allowedMimetypes={allowedMimetypes}
                initialFileIds={files.map((f) => f.id)}
                onClose={() => setDialogOpen(false)}
                onConfirm={handleConfirm}
            />
        </>
    );
};
