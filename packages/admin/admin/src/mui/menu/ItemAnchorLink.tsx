import { LinkExternal } from "@comet/admin-icons";
import { ListItemButtonProps } from "@mui/material";
import * as React from "react";

import { MenuItem, MenuItemProps } from "./Item";

export type MenuItemAnchorLinkProps = MenuItemProps & ListItemButtonProps & React.HTMLProps<HTMLAnchorElement>;

export const MenuItemAnchorLink: React.FC<MenuItemAnchorLinkProps> = ({ secondaryAction, isMenuOpen, slotProps, ...props }) => {
    const computedSecondaryAction =
        secondaryAction !== undefined ? (
            secondaryAction
        ) : (
            <>
                <LinkExternal color="primary" sx={{ marginRight: "auto", marginLeft: 2 }} fontSize={isMenuOpen ? "medium" : "small"} />
                {props.level}
            </>
        );

    return (
        <MenuItem
            selected={false}
            // @ts-expect-error "component"-property is used as described in the documentation  https://mui.com/material-ui/react-list/, but type is missing in ListItemButtonProps
            component="a"
            secondaryAction={computedSecondaryAction}
            isMenuOpen={isMenuOpen}
            slotProps={{
                ...slotProps,
                text: {
                    ...slotProps?.text,
                    sx: {
                        ...slotProps?.text?.sx,
                        flexGrow: 0, // make the text not grow to full width so that the icon can be next to the text
                    },
                },
            }}
            {...props}
        />
    );
};
