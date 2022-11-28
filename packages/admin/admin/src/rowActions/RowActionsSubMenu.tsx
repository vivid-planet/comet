import { ChevronRight, MoreVertical } from "@comet/admin-icons";
import { Menu, MenuProps } from "@mui/material";
import * as React from "react";

import { RowActionsIconItem, RowActionsIconItemProps } from "./RowActionsIconItem";
import { RowActionsListItem, RowActionsListItemProps } from "./RowActionsListItem";
import { RowActionsMenuContext } from "./RowActionsMenu";

export interface RowActionsSubMenuComponentsProps {
    rowActionsIconItem?: Partial<RowActionsIconItemProps>;
    rowActionsListItem?: Partial<RowActionsListItemProps>;
}

export interface RowActionsSubMenuProps extends Omit<MenuProps, "open" | "onClose" | "componentsProps"> {
    icon?: React.ReactNode;
    text?: React.ReactNode;
    menuIsOpen: boolean;
    closeMenu: () => void;
    openMenu: () => void;
    textSecondary?: React.ReactNode;
    endIcon?: React.ReactNode;
    componentsProps?: RowActionsSubMenuComponentsProps & MenuProps["componentsProps"];
}

export const RowActionsSubMenu = ({
    icon = <MoreVertical />,
    endIcon = <ChevronRight />,
    text,
    textSecondary,
    menuIsOpen,
    openMenu,
    closeMenu,
    componentsProps = {},
    ...restMenuProps
}: RowActionsSubMenuProps): React.ReactElement => {
    const { level } = React.useContext(RowActionsMenuContext);
    const menuIconItemButtonRef = React.useRef<HTMLButtonElement>(null);
    const menuListItemButtonRef = React.useRef<HTMLLIElement>(null);
    const showMenuButtonAsIconButton = level === 2;
    const { rowActionsIconItem: rowActionsIconItemProps, rowActionsListItem: rowActionsListItemProps, ...menuComponentsProps } = componentsProps;

    return (
        <>
            {showMenuButtonAsIconButton ? (
                <RowActionsIconItem onClick={openMenu} icon={icon} text={text} ref={menuIconItemButtonRef} {...rowActionsIconItemProps} />
            ) : (
                <RowActionsListItem
                    onClick={openMenu}
                    icon={icon}
                    text={text}
                    textSecondary={textSecondary}
                    endIcon={endIcon}
                    ref={menuListItemButtonRef}
                    {...rowActionsListItemProps}
                />
            )}
            <Menu
                anchorEl={showMenuButtonAsIconButton ? menuIconItemButtonRef.current : menuListItemButtonRef.current}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "center", horizontal: "left" }}
                {...menuComponentsProps}
                {...restMenuProps}
                open={menuIsOpen}
                onClose={closeMenu}
            />
        </>
    );
};
