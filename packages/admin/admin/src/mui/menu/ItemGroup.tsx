import { ComponentsOverrides, css, Theme, Typography, useThemeProps } from "@mui/material";
import React from "react";
import { FormattedMessage, MessageDescriptor, useIntl } from "react-intl";

import { Tooltip as CommonTooltip } from "../../common/Tooltip";
import { createComponentSlot } from "../../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { MenuChild, MenuCollapsibleItemProps } from "./CollapsibleItem";
import { MenuItemProps } from "./Item";
import { MenuItemRouterLinkProps } from "./ItemRouterLink";

export type MenuItemGroupClassKey = "root" | "open" | "tooltip" | "titleContainer" | "title" | "shortTitle";

type OwnerState = {
    open: boolean;
};

const Root = createComponentSlot("div")<MenuItemGroupClassKey, OwnerState>({
    componentName: "MenuItemGroup",
    slotName: "root",
    classesResolver: (ownerState) => {
        return [ownerState.open && "open"];
    },
})(
    ({ theme }) => css`
        margin-top: ${theme.spacing(8)};
    `,
);

const Tooltip = createComponentSlot(CommonTooltip)<MenuItemGroupClassKey>({
    componentName: "MenuItemGroup",
    slotName: "tooltip",
})();

const TitleContainer = createComponentSlot("div")<MenuItemGroupClassKey, OwnerState>({
    componentName: "MenuItemGroup",
    slotName: "titleContainer",
})(
    ({ theme, ownerState }) => css`
        border-bottom: 1px solid ${theme.palette.grey[50]};
        display: flex;
        justify-content: flex-start;
        padding: ${theme.spacing(2, 4)};
        align-items: center;
        gap: ${theme.spacing(1)};

        ${!ownerState.open &&
        css`
            padding-left: 0;
            padding-right: 0;
        `}
    `,
);

const Title = createComponentSlot(Typography)<MenuItemGroupClassKey, OwnerState>({
    componentName: "MenuItemGroup",
    slotName: "title",
})(
    ({ theme, ownerState }) => css`
        color: ${theme.palette.grey[900]};
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        ${!ownerState.open &&
        css`
            display: none;
        `}
    `,
);

const ShortTitle = createComponentSlot(Typography)<MenuItemGroupClassKey, OwnerState>({
    componentName: "MenuItemGroup",
    slotName: "shortTitle",
})(
    ({ theme, ownerState }) => css`
        border: 1px solid ${theme.palette.grey[100]};
        border-radius: 20px;
        color: ${theme.palette.grey[300]};
        padding: 1px 7px;
        margin-left: 20px;
        margin-right: auto;

        ${ownerState.open &&
        css`
            display: none;
        `}
    `,
);

export interface MenuItemGroupProps
    extends ThemedComponentBaseProps<{
        root: "div";
        tooltip: typeof CommonTooltip;
        titleContainer: "div";
        title: typeof Typography;
        shortTitle: typeof Typography;
    }> {
    title: React.ReactNode;
    shortTitle?: React.ReactNode;
    helperIcon?: React.ReactNode;
    children?: React.ReactNode;
    isMenuOpen?: boolean;
}

export const MenuItemGroup = (inProps: MenuItemGroupProps) => {
    const { title, shortTitle, helperIcon, children, isMenuOpen, slotProps, ...restProps } = useThemeProps({
        props: inProps,
        name: "CometAdminMenuItemGroup",
    });

    const intl = useIntl();

    const ownerState: OwnerState = { open: Boolean(isMenuOpen) };

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

    const childElements = React.useMemo(
        () =>
            React.Children.map(children, (child: MenuChild) => {
                return React.cloneElement<MenuCollapsibleItemProps | MenuItemRouterLinkProps | MenuItemProps>(child, {
                    isMenuOpen,
                });
            }),
        [children, isMenuOpen],
    );

    return (
        <Root ownerState={ownerState} {...slotProps?.root} {...restProps}>
            <Tooltip
                placement="right"
                disableHoverListener={isMenuOpen}
                disableFocusListener={isMenuOpen}
                disableTouchListener={isMenuOpen}
                title={title}
                {...slotProps?.tooltip}
            >
                <TitleContainer ownerState={ownerState} {...slotProps?.titleContainer}>
                    <ShortTitle variant="overline" ownerState={ownerState} {...slotProps?.shortTitle}>
                        {shortTitle || getInitials(title)}
                    </ShortTitle>
                    <Title variant="subtitle2" ownerState={ownerState} {...slotProps?.title}>
                        {title}
                    </Title>
                    {isMenuOpen && !!helperIcon && helperIcon}
                </TitleContainer>
            </Tooltip>
            {childElements}
        </Root>
    );
};

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminMenuItemGroup: MenuItemGroupProps;
    }

    interface ComponentNameToClassKey {
        CometAdminMenuItemGroup: MenuItemGroupClassKey;
    }

    interface Components {
        CometAdminMenuItemGroup?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminMenuItemGroup"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminMenuItemGroup"];
        };
    }
}
