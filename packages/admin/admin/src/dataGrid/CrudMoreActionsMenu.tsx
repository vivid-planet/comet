import { MoreVertical } from "@comet/admin-icons";
import { Button, Chip, css, Divider, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, MenuListProps, Typography } from "@mui/material";
import { Maybe } from "graphql/jsutils/Maybe";
import { ComponentProps, MouseEvent, PropsWithChildren, ReactNode, useState } from "react";
import { FormattedMessage } from "react-intl";

import { createComponentSlot } from "../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";

export type CrudMoreActionsMenuClassKey = "root" | "group" | "divider" | "button" | "chip" | "menuItem";

export interface ActionItem extends ComponentProps<typeof MenuItem> {
    label: ReactNode;
    icon?: ReactNode;
    divider?: boolean;
}

export interface CrudMoreActionsMenuProps
    extends ThemedComponentBaseProps<{
        menu: typeof Menu;
        menuItem: typeof MenuItem;
        button: typeof Button;
        group: typeof CrudMoreActionsGroup;
        divider: typeof CrudMoreActionsDivider;
        chip: typeof Chip;
    }> {
    selectionSize?: number;
    overallActions?: Maybe<ActionItem>[];
    selectiveActions?: Maybe<ActionItem>[];
}

interface CrudMoreActionsGroupProps {
    groupTitle: ReactNode;
    menuListProps?: MenuListProps;
    typographyProps?: ComponentProps<typeof Typography>;
}

function CrudMoreActionsGroup({ groupTitle, children, menuListProps, typographyProps }: PropsWithChildren<CrudMoreActionsGroupProps>) {
    return (
        <>
            <Typography variant="overline" color={(theme) => theme.palette.grey[500]} sx={{ padding: "20px 15px 0 15px" }} {...typographyProps}>
                {groupTitle}
            </Typography>
            <MenuList {...menuListProps}>{children}</MenuList>
        </>
    );
}

const CrudMoreActionsDivider = createComponentSlot(Divider)<CrudMoreActionsMenuClassKey>({
    componentName: "CrudMoreActions",
    slotName: "divider",
})(
    ({ theme }) => css`
        margin: 8px 10px;
        border-color: ${theme.palette.grey[50]};
    `,
);

const MoreActionsSelectedItemsChip = createComponentSlot(Chip)<CrudMoreActionsMenuClassKey>({
    componentName: "CrudMoreActions",
    slotName: "chip",
})(
    css`
        width: 20px;
        height: 20px;
        flex-shrink: 0;
        border-radius: 20px;
        margin-left: 1px;
    `,
);

const MoreActionsButton = createComponentSlot(Button)<CrudMoreActionsMenuClassKey>({
    componentName: "CrudMoreActions",
    slotName: "button",
})(
    css`
        margin: 0 10px;
    `,
);

const MoreActionsMenuItem = createComponentSlot(MenuItem)<CrudMoreActionsMenuClassKey>({
    componentName: "CrudMoreActions",
    slotName: "menuItem",
})(
    css`
        padding: 8px 15px 8px 30px !important;
        column-gap: 10px;
    `,
);

export function CrudMoreActionsMenu({ slotProps, overallActions, selectiveActions, selectionSize }: CrudMoreActionsMenuProps) {
    const {
        menu: menuProps,
        button: buttonProps,
        group: groupProps,
        divider: dividerProps,
        chip: chipProps,
    } = slotProps ?? { menu: {}, button: {}, group: {}, divider: {}, chip: {} };

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);

    const handleClose = () => setAnchorEl(null);

    return (
        <>
            <MoreActionsButton variant="text" color="inherit" endIcon={<MoreVertical />} {...buttonProps} onClick={handleClick}>
                <FormattedMessage id="comet.pages.dam.moreActions" defaultMessage="More actions" />
                {!!selectionSize && <MoreActionsSelectedItemsChip size="small" color="primary" {...chipProps} label={selectionSize} />}
            </MoreActionsButton>
            <Menu
                keepMounted={false}
                PaperProps={{ sx: { minWidth: 220, borderRadius: "4px" } }}
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                {...menuProps}
                onClose={(event, reason) => {
                    handleClose();
                    menuProps?.onClose?.(event, reason);
                }}
            >
                {!!overallActions?.length && (
                    <CrudMoreActionsGroup
                        groupTitle={<FormattedMessage id="comet.dam.moreActions.overallActions" defaultMessage="Overall actions" />}
                        {...groupProps}
                    >
                        {overallActions.map((item, index) => {
                            if (!item) return null;

                            const { divider, label, icon, onClick, ...rest } = item;

                            return (
                                <>
                                    <MoreActionsMenuItem
                                        key={index}
                                        disabled={!!selectionSize}
                                        {...rest}
                                        onClick={(e) => {
                                            onClick?.(e);
                                            handleClose();
                                        }}
                                    >
                                        {!!icon && <ListItemIcon sx={{ minWidth: "unset !important" }}>{icon}</ListItemIcon>}
                                        <ListItemText primary={label} />
                                    </MoreActionsMenuItem>
                                    {!!divider && <CrudMoreActionsDivider {...dividerProps} />}
                                </>
                            );
                        })}
                    </CrudMoreActionsGroup>
                )}

                {!!overallActions?.length && !!selectiveActions?.length && <CrudMoreActionsDivider {...dividerProps} />}

                {!!selectiveActions?.length && (
                    <CrudMoreActionsGroup
                        groupTitle={<FormattedMessage id="comet.dam.moreActions.selectiveActions" defaultMessage="Selective actions" />}
                        {...groupProps}
                    >
                        {selectiveActions.map((item, index) => {
                            if (!item) return;

                            const { divider, label, icon, onClick, ...rest } = item;

                            return (
                                <>
                                    <MoreActionsMenuItem
                                        key={index}
                                        disabled={!selectionSize}
                                        {...rest}
                                        onClick={(e) => {
                                            onClick?.(e);
                                            handleClose();
                                        }}
                                    >
                                        {!!icon && <ListItemIcon sx={{ minWidth: "unset !important" }}>{icon}</ListItemIcon>}
                                        <ListItemText primary={label} />
                                        {!!selectionSize && (
                                            <MoreActionsSelectedItemsChip size="small" color="primary" {...chipProps} label={selectionSize} />
                                        )}
                                    </MoreActionsMenuItem>
                                    {!!divider && <CrudMoreActionsDivider {...dividerProps} />}
                                </>
                            );
                        })}
                    </CrudMoreActionsGroup>
                )}
            </Menu>
        </>
    );
}
