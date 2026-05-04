import { useApolloClient } from "@apollo/client";
import { Delete, MoreVertical, OpenNewTab } from "@comet/admin-icons";
import { IconButton, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Stack } from "@mui/material";
import { type ComponentProps, isValidElement, type MouseEventHandler, type ReactElement, type ReactNode, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useContentScope } from "../../contentScope/Provider";
import { DamThumbnail } from "../../dam/DataGrid/thumbnail/DamThumbnail";
import { useDependenciesConfig } from "../../dependencies/dependenciesConfig";
import { DamPathLazy } from "./DamPathLazy";
import type { GQLDamMultiFileFieldFileFragment } from "./FileField.gql.generated";

interface ActionItem extends ComponentProps<typeof MenuItem> {
    label: ReactNode;
    icon?: ReactNode;
}

interface FileFieldRowProps {
    file: GQLDamMultiFileFieldFileFragment;
    onRemove: () => void;
    preview?: (file: GQLDamMultiFileFieldFileFragment) => ReactNode;
    menuActions?: Array<ActionItem | ReactElement | null | undefined>;
}

export const FileFieldRow = ({ file, onRemove, preview, menuActions }: FileFieldRowProps) => {
    const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

    const intl = useIntl();
    const contentScope = useContentScope();
    const apolloClient = useApolloClient();
    const { entityDependencyMap } = useDependenciesConfig();

    const handleMoreClick: MouseEventHandler<HTMLElement> = (event) => setMenuAnchorEl(event.currentTarget);
    const handleMenuClose = () => setMenuAnchorEl(null);

    const damDependency = entityDependencyMap["DamFile"];
    const showMoreMenu = Boolean(damDependency) || (menuActions !== undefined && menuActions.length > 0);

    return (
        <ListItem
            divider
            secondaryAction={
                <Stack direction="row">
                    <IconButton
                        size="small"
                        onClick={onRemove}
                        aria-label={intl.formatMessage({ id: "comet.form.file.removeFile", defaultMessage: "Remove" })}
                    >
                        <Delete color="action" />
                    </IconButton>
                    {showMoreMenu && (
                        <IconButton
                            size="small"
                            onClick={handleMoreClick}
                            aria-label={intl.formatMessage({ id: "comet.form.file.moreActions", defaultMessage: "More actions" })}
                        >
                            <MoreVertical color="action" />
                        </IconButton>
                    )}
                </Stack>
            }
        >
            <Stack direction="row" alignItems="center" spacing={2} flex={1} minWidth={0}>
                {preview ? preview(file) : <DamThumbnail asset={{ ...file, __typename: "DamFile" }} />}
                <ListItemText
                    primary={file.name}
                    secondary={<DamPathLazy fileId={file.id} />}
                    primaryTypographyProps={{ variant: "subtitle1", noWrap: true }}
                    secondaryTypographyProps={{ variant: "body2", color: "textSecondary", noWrap: true, component: "span" }}
                />
            </Stack>
            {showMoreMenu && (
                <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
                    {damDependency && (
                        <MenuItem
                            onClick={async () => {
                                handleMenuClose();
                                const path = await damDependency.resolvePath({ apolloClient, id: file.id });
                                window.open(contentScope.match.url + path, "_blank");
                            }}
                        >
                            <ListItemIcon>
                                <OpenNewTab />
                            </ListItemIcon>
                            <ListItemText primary={<FormattedMessage id="comet.form.file.openInDam" defaultMessage="Open in DAM" />} />
                        </MenuItem>
                    )}
                    {menuActions?.map((item, itemIndex) => {
                        if (!item) {
                            return null;
                        }
                        if (isValidElement(item)) {
                            return item;
                        }
                        const { label, icon, ...rest } = item as ActionItem;
                        return (
                            <MenuItem key={itemIndex} {...rest}>
                                {!!icon && <ListItemIcon>{icon}</ListItemIcon>}
                                <ListItemText primary={label} />
                            </MenuItem>
                        );
                    })}
                </Menu>
            )}
        </ListItem>
    );
};
