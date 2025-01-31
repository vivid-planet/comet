import { LinkExternal } from "@comet/admin-icons";
import { type ListItemButtonProps } from "@mui/material";
import { type HTMLProps } from "react";

import { MenuItem, type MenuItemProps } from "./Item";

export type MenuItemAnchorLinkProps = MenuItemProps & ListItemButtonProps & HTMLProps<HTMLAnchorElement>;

export const MenuItemAnchorLink = ({ secondaryAction: passedSecondaryAction, isMenuOpen, slotProps, ...props }: MenuItemAnchorLinkProps) => {
    const secondaryAction =
        passedSecondaryAction !== undefined ? ( // don't use ?? to allow null as value and with that an empty secondaryAction
            passedSecondaryAction
        ) : (
            <LinkExternal color="primary" sx={{ marginRight: "auto", marginLeft: 2 }} fontSize={isMenuOpen ? "medium" : "small"} />
        );

    return (
        <MenuItem
            selected={false}
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
