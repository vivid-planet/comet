import { MoreVertical } from "@comet/admin-icons";
import {
    Button,
    Chip,
    ChipProps,
    Divider,
    DividerProps,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    MenuList,
    MenuListProps,
    Typography,
} from "@mui/material";
import { Maybe } from "graphql/jsutils/Maybe";
import * as React from "react";
import { PropsWithChildren } from "react";
import { FormattedMessage } from "react-intl";

import { ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";

function CrudMoreActionsDivider(props: DividerProps) {
    return <Divider sx={{ margin: "8px 10px", borderColor: (theme) => theme.palette.grey[50] }} {...props} />;
}

interface CrudMoreActionsGroupProps {
    groupTitle: React.ReactNode;
    menuListProps?: MenuListProps;
    typographyProps?: React.ComponentProps<typeof Typography>;
}

function CrudMoreActionsGroup({ groupTitle, children, menuListProps, typographyProps }: PropsWithChildren<CrudMoreActionsGroupProps>) {
    return (
        <>
            <Typography variant="subtitle2" color={(theme) => theme.palette.grey[500]} fontWeight="bold" pt="20px" px="15px" {...typographyProps}>
                {groupTitle}
            </Typography>
            <MenuList {...menuListProps}>{children}</MenuList>
        </>
    );
}

export interface ActionItem extends React.ComponentProps<typeof MenuItem> {
    label: React.ReactNode;
    icon?: React.ReactNode;
    divider?: boolean;
}

export interface CrudMoreActionsMenuProps
    extends ThemedComponentBaseProps<{
        menu: typeof Menu;
    }> {
    selectionSize?: number;
    overallActions?: Maybe<ActionItem>[];
    selectiveActions?: Maybe<ActionItem>[];
}

function SelectedItemsChip({ label, ...restProps }: Partial<ChipProps>) {
    return (
        <Chip
            size="small"
            color="primary"
            sx={{ width: 20, height: 20, flexShrink: 0, borderRadius: 20, marginLeft: 1 }}
            {...restProps}
            label={label}
        />
    );
}

export function CrudMoreActionsMenu({ slotProps, overallActions, selectiveActions, selectionSize }: CrudMoreActionsMenuProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);

    const handleClose = () => setAnchorEl(null);

    return (
        <>
            <Button variant="text" color="inherit" endIcon={<MoreVertical />} sx={{ mx: 2 }} onClick={handleClick}>
                <FormattedMessage id="comet.pages.dam.moreActions" defaultMessage="More actions" />
                {!!selectionSize && <SelectedItemsChip label={selectionSize} />}
            </Button>
            <Menu
                keepMounted={false}
                PaperProps={{ sx: { minWidth: 220, borderRadius: "4px" } }}
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                {...slotProps?.menu}
                onClose={(event, reason) => {
                    handleClose();
                    slotProps?.menu?.onClose?.(event, reason);
                }}
            >
                {!!overallActions?.length && (
                    <CrudMoreActionsGroup
                        groupTitle={<FormattedMessage id="comet.dam.moreActions.overallActions" defaultMessage="Overall actions" />}
                    >
                        {overallActions.map((item, index) => {
                            if (!item) return null;

                            const { divider, label, icon, onClick, ...rest } = item;

                            return (
                                <>
                                    <MenuItem
                                        key={index}
                                        disabled={!!selectionSize}
                                        {...rest}
                                        onClick={(e) => {
                                            onClick?.(e);
                                            handleClose();
                                        }}
                                    >
                                        {!!icon && <ListItemIcon>{icon}</ListItemIcon>}
                                        <ListItemText primary={label} />
                                    </MenuItem>
                                    {!!divider && <CrudMoreActionsDivider />}
                                </>
                            );
                        })}
                    </CrudMoreActionsGroup>
                )}

                {!!overallActions?.length && !!selectiveActions?.length && <CrudMoreActionsDivider />}

                {!!selectiveActions?.length && (
                    <CrudMoreActionsGroup
                        groupTitle={<FormattedMessage id="comet.dam.moreActions.selectiveActions" defaultMessage="Selective actions" />}
                    >
                        {selectiveActions.map((item, index) => {
                            if (!item) return;

                            const { divider, label, icon, onClick, ...rest } = item;

                            return (
                                <>
                                    <MenuItem
                                        key={index}
                                        disabled={!selectionSize}
                                        {...rest}
                                        onClick={(e) => {
                                            onClick?.(e);
                                            handleClose();
                                        }}
                                    >
                                        {!!icon && <ListItemIcon>{icon}</ListItemIcon>}
                                        <ListItemText primary={label} />
                                        {!!selectionSize && <SelectedItemsChip label={selectionSize} />}
                                    </MenuItem>
                                    {!!divider && <CrudMoreActionsDivider />}
                                </>
                            );
                        })}
                    </CrudMoreActionsGroup>
                )}
            </Menu>
        </>
    );
}
