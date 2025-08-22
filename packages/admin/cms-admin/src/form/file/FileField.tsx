import { useApolloClient } from "@apollo/client";
import { Assets, Delete, MoreVertical, OpenNewTab } from "@comet/admin-icons";
import { Box, Divider, Grid, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from "@mui/material";
import { type ComponentProps, isValidElement, type ReactElement, type ReactNode, useState } from "react";
import { type FieldRenderProps } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { BlockAdminComponentButton } from "../../blocks/common/BlockAdminComponentButton";
import { BlockAdminComponentPaper } from "../../blocks/common/BlockAdminComponentPaper";
import { useContentScope } from "../../contentScope/Provider";
import { useDependenciesConfig } from "../../dependencies/dependenciesConfig";
import { ChooseFileDialog } from "./chooseFile/ChooseFileDialog";
import { DamPathLazy } from "./DamPathLazy";
import { damFileFieldFileQuery } from "./FileField.gql";
import { type GQLDamFileFieldFileFragment, type GQLDamFileFieldFileQuery, type GQLDamFileFieldFileQueryVariables } from "./FileField.gql.generated";

export { GQLDamFileFieldFileFragment } from "./FileField.gql.generated";

interface ActionItem extends ComponentProps<typeof MenuItem> {
    label: ReactNode;
    icon?: ReactNode;
}

interface FileFieldProps extends FieldRenderProps<GQLDamFileFieldFileFragment | undefined, HTMLInputElement> {
    buttonText?: string;
    allowedMimetypes?: string[];
    preview?: ReactNode;
    menuActions?: Array<ActionItem | ReactElement | null | undefined>;
}

const FileField = ({ buttonText, input, allowedMimetypes, preview, menuActions }: FileFieldProps) => {
    const [chooseFileDialogOpen, setChooseFileDialogOpen] = useState<boolean>(false);
    const client = useApolloClient();

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
                                if (!item) return null;

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
