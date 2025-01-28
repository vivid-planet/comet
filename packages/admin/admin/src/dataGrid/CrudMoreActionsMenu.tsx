import { MoreVertical } from "@comet/admin-icons";
import {
    Button,
    Chip,
    ComponentsOverrides,
    css,
    Divider,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    MenuList,
    MenuListProps,
    Theme,
    Typography,
    useTheme,
} from "@mui/material";
import { Maybe } from "graphql/jsutils/Maybe";
import { ComponentProps, MouseEvent, PropsWithChildren, ReactNode, useState } from "react";
import { FormattedMessage } from "react-intl";

import { createComponentSlot } from "../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";

export type CrudMoreActionsMenuClassKey = "root" | "group" | "divider" | "button" | "chip" | "menuItem";

interface ActionItem extends ComponentProps<typeof MenuItem> {
    label: ReactNode;
    icon?: ReactNode;
}

export interface CrudMoreActionsMenuProps
    extends ThemedComponentBaseProps<{
        menu: typeof Menu;
        menuItem: typeof MenuItem;
        button: typeof Button;
        group: typeof CrudMoreActionsGroup;
        divider: typeof Divider;
        chip: typeof Chip;
    }> {
    selectionSize?: number;
    overallActions?: Maybe<ActionItem>[];
    selectiveActions?: Maybe<ActionItem>[];
}

interface CrudMoreActionsGroupProps {
    groupTitle?: ReactNode;
    menuListProps?: MenuListProps;
    typographyProps?: ComponentProps<typeof Typography>;
}

function CrudMoreActionsGroup({ groupTitle, children, menuListProps, typographyProps }: PropsWithChildren<CrudMoreActionsGroupProps>) {
    const { palette } = useTheme();
    return (
        <>
            {groupTitle && (
                <Typography variant="overline" color={palette.grey[500]} sx={{ padding: "20px 15px 0 15px" }} {...typographyProps}>
                    {groupTitle}
                </Typography>
            )}
            <MenuList {...menuListProps}>{children}</MenuList>
        </>
    );
}

const CrudMoreActionsDivider = createComponentSlot(Divider)<CrudMoreActionsMenuClassKey>({
    componentName: "CrudMoreActions",
    slotName: "divider",
})();

const MoreActionsSelectedItemsChip = createComponentSlot(Chip)<CrudMoreActionsMenuClassKey>({
    componentName: "CrudMoreActions",
    slotName: "chip",
})(css`
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    border-radius: 20px;
    margin-left: 6px;
`);

const MoreActionsButton = createComponentSlot(Button)<CrudMoreActionsMenuClassKey>({
    componentName: "CrudMoreActions",
    slotName: "button",
})(css`
    margin: 0 10px;
`);

const MoreActionsMenuItem = createComponentSlot(MenuItem)<CrudMoreActionsMenuClassKey>({
    componentName: "CrudMoreActions",
    slotName: "menuItem",
})();

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
    const hasOverallActions = !!overallActions?.length;
    const hasSelectiveActions = !!selectiveActions?.length;

    return (
        <>
            <MoreActionsButton variant="text" color="inherit" endIcon={<MoreVertical />} {...buttonProps} onClick={handleClick}>
                <FormattedMessage id="comet.crudMoreActions.title" defaultMessage="More" />
                {!!selectionSize && <MoreActionsSelectedItemsChip size="small" color="primary" {...chipProps} label={selectionSize} />}
            </MoreActionsButton>
            <Menu
                keepMounted={false}
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                {...menuProps}
                onClose={(event, reason) => {
                    handleClose();
                    menuProps?.onClose?.(event, reason);
                }}
            >
                {hasOverallActions && (
                    <CrudMoreActionsGroup
                        groupTitle={
                            hasSelectiveActions ? (
                                <FormattedMessage id="comet.crudMoreActions.overallActions" defaultMessage="Overall actions" />
                            ) : undefined
                        }
                        {...groupProps}
                    >
                        {overallActions.map((item, index) => {
                            if (!item) return null;

                            const { divider, label, icon, onClick, ...rest } = item;

                            return (
                                <div key={index}>
                                    <MoreActionsMenuItem
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
                                    </MoreActionsMenuItem>
                                    {!!divider && <CrudMoreActionsDivider {...dividerProps} />}
                                </div>
                            );
                        })}
                    </CrudMoreActionsGroup>
                )}

                {hasOverallActions && hasSelectiveActions && <CrudMoreActionsDivider {...dividerProps} />}

                {hasSelectiveActions && (
                    <CrudMoreActionsGroup
                        groupTitle={
                            hasOverallActions ? (
                                <FormattedMessage id="comet.crudMoreActions.selectiveActions" defaultMessage="Selective actions" />
                            ) : undefined
                        }
                        {...groupProps}
                    >
                        {selectiveActions.map((item, index) => {
                            if (!item) return;

                            const { divider, label, icon, onClick, ...rest } = item;

                            return (
                                <div key={index}>
                                    <MoreActionsMenuItem
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
                                        {!!selectionSize && (
                                            <MoreActionsSelectedItemsChip size="small" color="primary" {...chipProps} label={selectionSize} />
                                        )}
                                    </MoreActionsMenuItem>
                                    {!!divider && <CrudMoreActionsDivider {...dividerProps} />}
                                </div>
                            );
                        })}
                    </CrudMoreActionsGroup>
                )}
            </Menu>
        </>
    );
}

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminCrudMoreActionsMenu: CrudMoreActionsMenuProps;
    }

    interface ComponentNameToClassKey {
        CometAdminCrudMoreActionsMenu: CrudMoreActionsMenuClassKey;
    }

    interface Components {
        CometAdminCrudMoreActionsMenu?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminCrudMoreActionsMenu"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminCrudMoreActionsMenu"];
        };
    }
}
