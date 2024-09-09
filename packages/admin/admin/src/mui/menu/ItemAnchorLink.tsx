import { LinkExternal } from "@comet/admin-icons";
import { ListItemButtonProps } from "@mui/material";
import * as React from "react";
import { FC, HTMLProps } from "react";

import { MenuItem, MenuItemProps } from "./Item";

export type MenuItemAnchorLinkProps = MenuItemProps & ListItemButtonProps & HTMLProps<HTMLAnchorElement>;

export const MenuItemAnchorLink: FC<MenuItemAnchorLinkProps> = ({ secondaryAction: passedSecondaryAction, isMenuOpen, slotProps, ...props }) => {
    const secondaryAction =
        passedSecondaryAction !== undefined ? ( // don't use ?? to allow null as value and with that an empty secondaryAction
            passedSecondaryAction
        ) : (
            <LinkExternal color="primary" sx={{ marginRight: "auto", marginLeft: 2 }} fontSize={isMenuOpen ? "medium" : "small"} />
        );

    return (
        <MenuItem
            selected={false}
            // @ts-expect-error "component"-property is used as described in the documentation  https://mui.com/material-ui/react-list/, but type is missing in ListItemButtonProps
            component="a"
            secondaryAction={secondaryAction}
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
