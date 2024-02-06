import { Box, ComponentsOverrides, Theme, Typography } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import clsx from "clsx";
import * as React from "react";
import { FormattedMessage, MessageDescriptor, useIntl } from "react-intl";

import { Tooltip } from "../../common/Tooltip";
import { MenuContext } from "./Context";

export type MenuItemGroupClassKey = "root" | "title" | "titleMenuOpen" | "titleContainer" | "titleContainerMenuOpen";

const styles = (theme: Theme) =>
    createStyles<MenuItemGroupClassKey, MenuItemGroupProps>({
        root: { marginTop: theme.spacing(8) },
        title: {
            fontWeight: 600,
            fontSize: 12,
            border: `2px solid ${theme.palette.grey[100]}`,
            borderRadius: 20,
            padding: theme.spacing(0.5, 2),
            lineHeight: "20px",
            color: `${theme.palette.grey[300]}`,
        },
        titleMenuOpen: {
            fontWeight: 600,
            fontSize: 14,
            border: `2px solid ${theme.palette.common.white}`,
            borderRadius: "initial",
            padding: 0,
            marginRight: theme.spacing(1),
            color: theme.palette.common.black,
        },
        titleContainer: {
            borderBottom: `1px solid ${theme.palette.grey[50]}`,
            display: "flex",
            justifyContent: "center",
            padding: `${theme.spacing(2)} 0`,
        },
        titleContainerMenuOpen: {
            justifyContent: "flex-start",
            padding: theme.spacing(2, 4),
            alignItems: "center",
        },
    });

export interface MenuItemGroupProps {
    title: React.ReactNode;
    shortTitle?: React.ReactNode;
    helperIcon?: React.ReactNode;
}

const ItemGroup: React.FC<React.PropsWithChildren<WithStyles<typeof styles> & MenuItemGroupProps>> = ({
    title,
    shortTitle,
    helperIcon,
    children,
    classes,
}) => {
    const { open: menuOpen } = React.useContext(MenuContext);
    const intl = useIntl();
    let displayedTitle = title;

    function isFormattedMessage(node: React.ReactNode): node is React.ReactElement<MessageDescriptor> {
        return !!node && React.isValidElement(node) && node.type === FormattedMessage;
    }

    function getInitials(title: React.ReactNode) {
        let titleAsString: string;
        if (typeof title === "string") {
            titleAsString = title;
        } else if (isFormattedMessage(title)) {
            titleAsString = intl.formatMessage(title.props);
        } else {
            throw new TypeError("Title must be either a string or a FormattedMessage");
        }
        const words = titleAsString.split(/\s+/).filter((word) => word.match(/[A-Za-z]/));

        if (words.length > 3) {
            console.warn("Title has more than 3 words, only the first 3 will be used.");

            return words
                .slice(0, 3)
                .map((word) => word[0].toUpperCase())
                .join("");
        }
        return words.map((word) => word[0].toUpperCase()).join("");
    }

    if (!menuOpen) {
        displayedTitle = shortTitle || getInitials(title);
    }

    return (
        <Box className={classes.root}>
            <Tooltip placement="right" disableHoverListener={menuOpen} disableFocusListener={menuOpen} disableTouchListener={menuOpen} title={title}>
                <Box className={clsx(classes.titleContainer, menuOpen && classes.titleContainerMenuOpen)}>
                    <Typography className={clsx(classes.title, menuOpen && classes.titleMenuOpen)} variant="h3">
                        {displayedTitle}
                    </Typography>
                    {menuOpen && helperIcon}
                </Box>
            </Tooltip>
            {children}
        </Box>
    );
};

export const MenuItemGroup = withStyles(styles, { name: "CometAdminMenuItemGroup" })(ItemGroup);

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminMenuItemGroup: MenuItemGroupProps;
    }

    interface ComponentNameToClassKey {
        CometAdminMenuItemGroup: MenuItemGroupClassKey;
    }

    interface Components {
        CometAdminMenuItemGroup?: {
            defaultProps?: ComponentsPropsList["CometAdminMenuItemGroup"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminMenuItemGroup"];
        };
    }
}
