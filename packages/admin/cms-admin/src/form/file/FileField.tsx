import { useApolloClient } from "@apollo/client";
import { Assets, Delete, MoreVertical, OpenNewTab } from "@comet/admin-icons";
import { AdminComponentButton, AdminComponentPaper } from "@comet/blocks-admin";
import { Divider, Grid, IconButton, ListItemIcon, Menu, MenuItem, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import { FieldRenderProps } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { useContentScope } from "../../contentScope/Provider";
import { useDependenciesConfig } from "../../dependencies/DependenciesConfig";
import { ChooseFileDialog } from "./chooseFile/ChooseFileDialog";
import { DamPathLazy } from "./DamPathLazy";
import { damFileFieldFileQuery } from "./FileField.gql";
import { GQLDamFileFieldFileFragment, GQLDamFileFieldFileQuery, GQLDamFileFieldFileQueryVariables } from "./FileField.gql.generated";

export { GQLDamFileFieldFileFragment } from "./FileField.gql.generated";

interface FileFieldProps extends FieldRenderProps<GQLDamFileFieldFileFragment | undefined, HTMLInputElement> {
    buttonText?: string;
    allowedMimetypes?: string[];
}

const FileField = ({ buttonText, input, allowedMimetypes }: FileFieldProps) => {
    const [chooseFileDialogOpen, setChooseFileDialogOpen] = useState<boolean>(false);
    const client = useApolloClient();

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [open, setOpen] = useState(false);

    const contentScope = useContentScope();
    const apolloClient = useApolloClient();
    const dependencyMap = useDependenciesConfig();

    const handleClose = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const handleCropClick = () => {
        setOpen(true);

        handleMenuClose();
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const damFile = input.value;

    if (damFile) {
        return (
            <>
                <AdminComponentPaper disablePadding>
                    <Grid container alignItems="center" spacing={3}>
                        <Grid item xs>
                            <Typography variant="subtitle1">{damFile.name}</Typography>
                            <Typography variant="body1" color="textSecondary">
                                <DamPathLazy fileId={damFile.id} />
                            </Typography>
                        </Grid>
                        <Grid item>
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
                    </Grid>
                    <Divider />
                    <AdminComponentButton startIcon={<Delete />} onClick={() => input.onChange(undefined)}>
                        <FormattedMessage id="comet.blocks.image.empty" defaultMessage="Empty" />
                    </AdminComponentButton>
                </AdminComponentPaper>
                <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
                    {dependencyMap["DamFile"] && damFile?.id && (
                        <MenuItem
                            onClick={async () => {
                                // id is checked three lines above
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                const path = await dependencyMap["DamFile"].resolvePath({ apolloClient, id: damFile.id });
                                const url = contentScope.match.url + path;
                                window.open(url, "_blank");
                            }}
                        >
                            <ListItemIcon>
                                <OpenNewTab />
                            </ListItemIcon>
                            <FormattedMessage id="comet.blocks.image.openInDam" defaultMessage="Open in DAM" />
                        </MenuItem>
                    )}
                </Menu>
            </>
        );
    }

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
